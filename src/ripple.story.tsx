import { Meta, Story } from '@storybook/react'
import styled from 'styled-components'
import useRipple, { RippleProps } from './ripple'

const ComponentMeta: Meta = {
  title: 'Ripple',
}

export default ComponentMeta

const Container = styled.div`
  width: 20rem;
  height: 20rem;
  background-color: rebeccapurple;
`

const Template: Story<RippleProps> = (args) => {
  const { anchor } = useRipple(args)

  return <Container ref={anchor}></Container>
}

export const clearType = Template.bind({})
clearType.args = {}

export const allProps = Template.bind({})
allProps.args = {
  toCenter: true,
}
