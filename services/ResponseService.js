function buildSuccess(_message,_data){
    return {
        'status': 'success',
        'data': _data,
        'message': _message
    }
}

function buildFailure(_message,_data){
    return {
        'status': 'failure',
        'data': _data,
        'message': _message
    }
}

function sendResponse(_response,_responseData)
{
    let _overrideHttpCode = _responseData['overrideHttpCode'] || false;

    if(_overrideHttpCode == false)
    {
        if(_responseData.status == 'success')
        {
            _overrideHttpCode = 200;
        }
        else
        {
            _overrideHttpCode = 500;
        }
    }

    return _response.status(_overrideHttpCode).json(_responseData)
}

function buildValidationMessage(_arrMessage){
  let _msg = 'Something went wrong please try again.';

  if(_arrMessage[0] != undefined){
    _msg = _arrMessage[0].message;
  }
  else if(typeof _arrMessage == 'string'){
      return _arrMessage;
  }

  return _msg;
}

module.exports = {
    buildSuccess,
    buildFailure,
    sendResponse,
    buildValidationMessage
}
