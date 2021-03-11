import { question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
async function runQuery() {
    const client = await new Client({ database: 'omdb' });
    client.connect()
    console.log(`Welcome to search-movies-cli, ${process.env.USER}!`);
    let status=true
    while (status===true) { //CONST works because: declared + assigned within a LOOP
        const searchString = question('Insert some letters you would like to search for, or insert q to quit \n').toLowerCase()
        if (searchString==='q') {
            status=false
        }
        else {
        const response = await client.query("SELECT id, name, date, runtime, budget, revenue, vote_average, votes_count FROM movies WHERE kind='movie' and lower(name) LIKE $1 ORDER BY date DESC LIMIT 10", [`%${searchString}%`])
        console.table(response.rows)
    }}
    client.end()
}

// runQuery();

async function runChoice() {
    const client = await new Client({ database: 'omdb' });
    client.connect()
    console.log(`Welcome to search-movies-cli, ${process.env.USER}!`);
    let status=true
    while (status===true) {
        const searchString = question('What would you like to do? \n[1] Search \n[2] See favourites \n[3] Quit \nChoose 1, 2 or 3:  ')
        if (searchString==='1') {
            const searchString = question('Insert some letters you would like to search for \n').toLowerCase()
            const response = await client.query("SELECT id, name, date, runtime, budget, revenue, vote_average, votes_count FROM movies WHERE kind='movie' and lower(name) LIKE $1 ORDER BY date DESC LIMIT 10", [`%${searchString}%`])
            console.table(response.rows)
            response.rows.map((movie, index) => console.log(`[${index}] ${movie.name}`))
            const indexToSave = Number(question('Which would you like to save to favourites? Insert index number here: '))
            const toSave = await client.query("INSERT INTO favourites VALUES $1 $2", [indexToSave, response.rows[indexToSave].name])
        }
        else if (searchString==='2') {

        }
        else {
            status=false
        }
        
    }
    client.end()
}

runChoice();
