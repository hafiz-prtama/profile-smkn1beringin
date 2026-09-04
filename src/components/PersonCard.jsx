import React from "react";
export default function PersonCard({ person, principal = false }) {
  return (
    <article className={`person-card ${principal ? "principal" : ""}`}>
      <div className="person-photo-wrap">
        <img src={person.photo} alt={person.name} />
      </div>
      <div className="person-content">
        <span>{person.role}</span>
        <h3>{person.name}</h3>
        {principal && <p>{person.greeting}</p>}
      </div>
    </article>
  );
}