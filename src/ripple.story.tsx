import { Meta, Story } from '@storybook/react'
import styled from 'styled-components'
import useRipple, { RippleProps } from './ripple'

const ComponentMeta: Meta = {
  title: 'Ripple',
}

export default ComponentMeta

const Container = styled.div`
  height: 4rem;
  width: 10rem;
  background-color: rebeccapurple;
`

const Template: Story<RippleProps> = (args) => {
  const { anchor } = useRipple(args)

  return <Container tabIndex={0} ref={anchor}></Container>
}

export const clearType = Template.bind({})
clearType.args = {}

export const allProps = Template.bind({})
allProps.args = {
  toCenter: true,
  disabled: false,
}
