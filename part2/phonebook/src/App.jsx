import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input value={search} onChange={handleSearchChange}/>
    </div>
  )
}

const PersonForm = ({ onSubmit, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map(person => 
        <Person 
          key={person.id}
          person={person}
          deletePerson={() => deletePerson(person.id)}
        />
      )}
    </div>
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={deletePerson}>delete</button>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [search, setSearch] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initalPersons => {
        setPersons(initalPersons)
      })
  }, [])

  const addPerson = event => {
    event.preventDefault()

    const personObject = { 
      name: newName, 
      number: newNumber,
    }

    const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (person)
      updatePerson(person.id)
    else
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
  }

  const deletePerson = id => {
    const personToRemove = persons.find(p => p.id === id)

    if (confirm(`Delete ${personToRemove.name}?`)) {
      personService
        .del(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const updatePerson = id => {
    const person = persons.find(p => p.id === id)
    const updatedPerson = { ...person, number: newNumber }

    if (confirm(`${person.name} is already added to the phonebook, update number?`)) {
      personService
        .update(id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id === id ? returnedPerson : p))
        })

      setNewName('')
      setNewNumber('')
    }
  }

  const handleSearchChange = e =>
    setSearch(e.target.value)

  const handleNameChange = e =>
    setNewName(e.target.value)

  const handleNumberChange = e =>
    setNewNumber(e.target.value)

  const personsToShow = (search === '')
    ? persons
    : persons.filter(p => p.name.toLowerCase().startsWith(search.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App