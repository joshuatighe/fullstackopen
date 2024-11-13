const Header = ({ coursename }) => {
  return (
    <div>
      <h2>{coursename}</h2>
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Part = ({ part }) => {
  return (
    <div>
      <p>{part.name} {part.exercises}</p>
    </div>
  )
}


const Total = ({ parts }) => {
  const total =
    parts.reduce((accum, part) => accum += part.exercises, 0)

  return (
    <div>
      <b>total of {total} exercises</b>
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header coursename={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course