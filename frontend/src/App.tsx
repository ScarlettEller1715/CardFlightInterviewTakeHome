import './App.css';
import React, { useEffect, useState } from "react";

function App() {

  const [message, setMessage] = useState("")

  const [newTransaction, setNewTransaction] = useState("")

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/transaction")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/v1/processtransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({newTransaction})
      });

      const data = await res.json();
      console.log(data)
      setNewTransaction("")
    } catch (error) {
      console.error("Error subitting transaction:", error)
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='transactionInput'>Enter Transaction Data:</label>
          <input id="transactionInput" 
            type="text"
            value={newTransaction}
            onChange={(e) => setNewTransaction(e.target.value)} 
            />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
      <p>{message}</p>
      </div>
    </div>
  );
}

export default App;
