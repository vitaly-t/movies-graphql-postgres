const crews = {
  Director: () => 'director',
  Writing: () => 'writer',
  Screenplay: () => 'writer',
  Writer: () => 'writer',
  Music: () => 'music',
  'Original Music Composer': () => 'music'
}

/**
 * Collect the crew members of a movie
 * @param  {string} job - Type of job
 * @return {[type]} [description]
 */
function findCrew(job) {
  const crew = crews[job]
  return crew ? crew() : null
}

function getCrew(data) {
  const crew = {
    director: [],
    writer: [],
    music: []
  }

  data.forEach(person => {
    var crewType = findCrew(person.job)

    if (crewType) {
      crew[crewType].push(person.name)
    }
  })

  return crew
}

const getNames = array => array.map(arr => arr.name)

const findRoleId = role => {
  switch (role) {
    case 'director':
      return 1
    case 'actor':
      return 2
    case 'writer':
      return 3
    case 'composer':
      return 4
  }
}

const crewQuery = (role, arrayName, outName) => {
  return `
    LATERAL (
      SELECT 
        ARRAY (
          SELECT 
            trim(p.name) 
          FROM 
            cast_and_crew AS cac 
            INNER JOIN people AS p ON p.id = cac.person_id 
          WHERE 
            cac.movie_id = m.id 
            AND cac.role_id = ${role}
        ) as ${arrayName}
    ) as ${outName}
  `
}

const combineQuery = (singular, plural, outName) => {
  return `
    LATERAL (
      SELECT 
        ARRAY (
          SELECT 
            trim(p.name)
          FROM 
            movie_${plural} AS comb 
            INNER JOIN ${plural} AS p ON p.id = comb.${singular}_id
          WHERE 
            comb.movie_id = m.id
        ) as ${plural}
    ) as ${outName} 
  `
}

const movieSelects = `
  img.poster, 
  img.backdrop,
  a.actors, 
  d.directors,
  co.composers, 
  w.writers,
  g.genres, 
  c.countries, 
  l.languages, 
  pc.production_companies
`

const movieLaterals = `
  LATERAL (
    SELECT * FROM images WHERE movie_id = m.id
  ) as img,
  ${combineQuery('genre', 'genres', 'g')},
  ${combineQuery('country', 'countries', 'c')},
  ${combineQuery('language', 'languages', 'l')},
  ${combineQuery('production_company', 'production_companies', 'pc')},
  ${crewQuery(1, 'directors', 'd')},
  ${crewQuery(2, 'actors', 'a')},
  ${crewQuery(3, 'writers', 'w')},
  ${crewQuery(4, 'composers', 'co')}
`

module.exports = {
  getCrew,
  getNames,
  movieLaterals,
  movieSelects,
  findRoleId
}
