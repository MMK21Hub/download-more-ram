export function Icon(props: { children: string }): JSX.Element {
  return <span class="iconify icon" data-icon={props.children}></span>
}
