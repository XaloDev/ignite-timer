import { ButtonContainer, ButtonVariant } from "./Button.styles"

interface ButtonProps {
    variant?: ButtonVariant
    children: React.ReactNode
}

export function Button(props: ButtonProps) {
    return (
        <ButtonContainer variant={props.variant || 'primary'}>{props.children}</ButtonContainer>
    )
}