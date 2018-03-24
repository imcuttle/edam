/**
 * @file suggest
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import { h, render, Component, Text } from '../ink'
import Suggest from 'ink-autocomplete'

// Demo
class Demo extends Component {
  state = {
    value: '',
    selected: null
  }

  render(props, { value, selected }) {
    const countries = [
      {
        label: 'United Kingdom',
        value: { country: 'United Kingdom', capital: 'London' }
      },
      {
        label: 'United States',
        value: { country: 'United States', capital: 'Washington DC' }
      },
      {
        label: 'United Arab Emirates',
        value: { country: 'United Arab Emirates', capital: 'Abu Dhabi' }
      }
    ]

    return h(
      'div',
      {},
      h(Text, { green: true }, 'Enter your country: '),
      h(Suggest, {
        value,
        placeholder: 'Type a country',
        items: countries,
        onChange: this.handleChange,
        onSubmit: this.handleSubmit
      }),
      selected &&
        h(
          'span',
          {},
          h(Text, {}, 'The capital of your country is: '),
          h(Text, { red: true }, selected.value.capital)
        )
    )
  }

  handleChange = value => {
    this.setState({
      value,
      selected: null
    })
  }

  handleSubmit = selected => {
    this.setState({
      selected
    })
  }
}

render(h(Demo))
