import { Table } from "flowbite-react"

const Error = ({ message }) => {
  return (
    <Table.Row>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell>
                  <div className="text-black text-2xl">
                    <h1>There is an error, please try again later...</h1>
                    <br></br>
                    <p>Error message: {message}</p>
                  </div>
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
  )
}

export default Error