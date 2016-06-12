import React from 'react'

class TextInputForm extends React.Component {

  constructor(props) {
    super(props)

    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleSubmit(e) {
    e.preventDefault()

    const inputTextElement = this.refs['input-text']
    const inputText = inputTextElement.value

    this.props.onSubmit(inputText)
    inputTextElement.value = ''
  }

  render() {
    return (
      <form onSubmit={this._handleSubmit}>
        <div className='form-group'>
          <div className='input-group'>
            <input type='text' className='form-control' id='input-text' ref='input-text' placeholder={this.props.placeholder} />
            <span className='input-group-btn'>
              <input type='submit' className='btn btn-default' defaultValue='Submit' />
            </span>
          </div>
        </div>
      </form>
    )
  }
}

export default TextInputForm
