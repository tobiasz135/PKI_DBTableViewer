import { Modal, useModal, Button, Text, Table, Input, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function App(props:any) {
    const { setVisible, bindings } = useModal();
    let newEntity:any = {};
    let [columns, setColumns] = useState([]);
    
    const fetchColumns = () => {
        fetch("/api/getColumns", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                database: props.currentDb,
                table: props.table,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setColumns(data.results);
                setVisible(true);
            }
        );
    };

    const submitRecord = () => {
        console.log(newEntity)
        fetch("/api/addRecord", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                database: props.currentDb,
                table: props.table,
                newEntity: newEntity
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                props.refreshData();
            }
        );
        setVisible(false);
    }



  return (
    <div>
      {props.table ? <Button auto flat as={Link} color='primary' shadow  onPress={() => {fetchColumns()}}>   
        Add new record
      </Button>
      : <Button auto flat color='primary' shadow disabled>
        Add new record
        </Button>}
      <Modal
        scroll
        width="100%"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Add new record
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <Table.Header>
              {columns.map((e:any) => (
                <Table.Column key={e.Field}>{e.Field}</Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              <Table.Row>
                {columns.map((f:any, idx2) => (
                  <Table.Cell key={idx2}>
                    {f.Key === "PRI" 
                        ? "Value will be auto-generated" 
                        : <Input placeholder="Enter value" onChange={(e) => newEntity[f.Field] = e.target.value}/>
                    }
                  </Table.Cell>
                ))}
              </Table.Row>
            </Table.Body>
          </Table>

          
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={() => setVisible(false)}>
            Cancel
          </Button>
          <Button auto flat onPress={() => submitRecord()}>
            Add record
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}