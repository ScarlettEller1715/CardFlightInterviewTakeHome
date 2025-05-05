# CardFlightInterviewTakeHome

Hi! I'm Scarlett Eller, this is my take home interview for the CardFlight Mid-Level Fullstack Engineer position. 

This submission utilizes a React and TypeScript Frontend with a Ruby on Rails API backend and PostgreSQL database.

## My Approach to the Interview

After setting up the basics, my first priority was handling the core logic of parsing the transaction string. I approached this by iterating over the string in multiple passes, extracting segments based on fixed-length patterns and expected formats.

The parsing logic is very basic. It assumes the input string conforms exactly to the provided structure. In cases where the structure deviates (such as the third example: "103JCB502QS316COSTSAVERGROCERY20564.80"), the parser will fail and return a validation error. 

For the frontend, I used React with TypeScript and hooks to manage state. An input handles the transaction string and a POST function sends it to the backend. When an appropriate response is returned, it updates the UI via local state. I used conditional rendering to prevent any null or undefined data from rendering.

## Prerequisites
- Ruby version 3.2 or newer
- Rails v7 or newer
- PostgreSQL
- npm

## Structure
- ScarlettEllerCardFlightInterview
    - backend
    - frontend

## Backend Setup
1. Navigate to the backend directory
2. Set the following environment variables (replace values as needed):
    - `export DB_USERNAME=postgres`
    - `export DB_PASSWORD=yourpassword`
3. Ensure PostgreSQL is installed and running on your machine
4. Install dependencies and set up the database:
    - `bundle install`
    - `rails db:create db:migrate`
5. Start the server:
    - `rails server`
    - Rails should now be running at http://localhost:3000

The database config (`config/database.yml`) is set to read these environment variables, so credentials are not hardcoded.

## Frontend Setup
1. Navigate to frontend
2. run `npm install`
3. run `npm start`

## Application Workflow
- The frontend asynchronously pulls any previously recorded transaction objects
- The frontend sends a transaction string via POST to http://localhost:3000/processtransaction.
- The Rails backend parses the string, saves it to the PostgreSQL database, and returns structured JSON.
- The frontend displays the latest transaction.

## Tests
- This application includes some basic tests to ensure that transactions can be processed
- To run the tests, run "bundle exec rspec" in the backend folder