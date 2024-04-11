import React, { useState } from "react";
import { PartTimerRegistrationForm } from "../../organisms/PartTimerRegistrationForm";
import { QuestionCard } from "../../organisms/QuestionCard";


const NewParttimer = () => {

    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");
    
  return (
    <div>
      <div className="justify-content-center ">
        {showForm ? <PartTimerRegistrationForm /> :
    <QuestionCard setShowForm={setShowForm} setMessage={setMessage} />
  }
  </div>
  </div>
  )
}

export default NewParttimer