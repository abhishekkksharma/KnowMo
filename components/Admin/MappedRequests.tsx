import React from 'react'
import Requests from './Requests'

function MappedRequests() {
  return (
    <div className='flex flex-col gap-2 p-4'>
        <Requests type="department" department="cse" email="abhishek@exampl.com" year={2} />
        <Requests type="subject" subject='Datastures and object oriented programming' department="cse" email="abhishek@exampl.com" year={2} />
        <Requests type="department" department="cse" email="abhishek@exampl.com" year={2} />
    </div>
  )
}

export default MappedRequests