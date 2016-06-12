import React from 'react'
import ReactDOM from 'react-dom'
import TextInputForm from './TextInputForm'

class HomePage extends React.Component {

  constructor(props) {
    super(props)
  }

  _handleSubmitMessage(value) {
    $.ajax({
      url: '/api/v1/message',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType : 'json',
      data: JSON.stringify({
        'text': value
      }),
    })
  }

  render() {
    return (
      <div>
        <h1>Cloud Matrix</h1>
        <TextInputForm onSubmit={this._handleSubmitMessage} placeholder='Enter some message...' />
      </div>
    )
  }

}

export default HomePage
