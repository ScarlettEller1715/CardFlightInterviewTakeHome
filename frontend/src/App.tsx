import './App.css';
import React, { useEffect, useState } from "react";

type Transaction = {
  amount: string; 
  network: string;
  transaction_descriptor: string;
  transaction_id: string;
  version: string; 
  merchant: string;
};

function App() {

  const [message, setMessage] = useState("")

  const [newTransaction, setNewTransaction] = useState("")
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

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

      if (res.ok) {
        setLastTransaction(data.last_transaction)
        setNewTransaction("")
      } else {
        alert("Transaction does not follow template specifications, please try again.")
      }
    } catch (error) {
      console.log("hit")
      alert(`Error submitting transaction: ${error}`)
    }
  };

  console.log(lastTransaction)

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
        {lastTransaction === null ? <h3>Please Create a Transaction</h3> 
          : 
          <div> 
            <h3>Information about your Previous Transaction</h3>
            <p>Amount: {lastTransaction?.amount}</p>
            <p>Network: {lastTransaction?.network}</p>
            <p>Descriptor: {lastTransaction?.transaction_descriptor}</p>
            <p>Merchant: {lastTransaction?.merchant}</p>
            <p>Transaction ID: {lastTransaction?.transaction_id}</p>
            <p>Version: {lastTransaction?.version}</p>
          </div>
        }
      </div>
      <div>
      <p>{message}</p>
      </div>
    </div>
  );
}

export default App;
