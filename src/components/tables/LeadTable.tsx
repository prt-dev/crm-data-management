import BasicTableOne, { BasicTableOneProps, LeadItem } from "./BasicTableOne";

export type { BasicTableOneProps as LeadTableProps, LeadItem };

export default function LeadTable(props: BasicTableOneProps) {
  return <BasicTableOne {...props} />;
}
