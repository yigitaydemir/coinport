import { Table,  } from "flowbite-react";

const Loading = () => {
  return (
    <Table.Row>
      <Table.Cell></Table.Cell>
      <Table.Cell></Table.Cell>
      <Table.Cell></Table.Cell>
      <Table.Cell>
        <h1 className="text-black text-2xl">Loading...</h1>
      </Table.Cell>
      <Table.Cell></Table.Cell>
      <Table.Cell></Table.Cell>
    </Table.Row>
  );
};

export default Loading;
