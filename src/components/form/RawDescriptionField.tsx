export interface RawDescriptionFieldProps {
  name: string;
  id?: string;
}

export const RawDescriptionFieldProps = (props: RawDescriptionFieldProps) => {
  return (
    <>
      <textarea name={props.name} class="textarea" id={props.id} />
    </>
  );
};
