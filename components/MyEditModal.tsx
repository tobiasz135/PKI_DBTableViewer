import { Modal, useModal, Button, Text, Table, Input } from "@nextui-org/react";
import { useEffect } from "react";

export default function App(props:any) {
  const { setVisible, bindings } = useModal();
  let entity = {...props.e};
  let newEntity = {...props.e};
  let keys = Object.keys(entity);
  
  const handleEdit = (e:any) => {
    console.log("editing row");
    console.log(e);
    console.log(newEntity)
    console.log(keys)
    fetch("/api/editRow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        database: props.database,
        table: props.table,
        row: e,
        newEntity: newEntity
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        props.refreshData();
      });
    setVisible(false);
  }

  return (
    <div>
      <Button color="primary" ghost bordered size='xs' onPress={() => setVisible(true)}>   
        Edit
      </Button>
      <Modal
        scroll
        width="100%"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Edit this record
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <Table.Header>
              {keys.map((e) => (
                <Table.Column key={e}>{e}</Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              <Table.Row>
                {keys.map((f, idx2) => (
                  f.includes("id") ? <Table.Cell key={idx2}>
                    {entity[f]}
                  </Table.Cell> :
                  <Table.Cell key={idx2}>
                    <Input placeholder={entity[f]} onChange={(e) => newEntity[f] = e.target.value}/>
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
          <Button auto onPress={() => handleEdit(entity)}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}