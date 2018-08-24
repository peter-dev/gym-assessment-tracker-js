# HDip in Computer Science - WIT, ICT Skills - Assignment

## A web-based javascript app to periodically track assessments on individual members

### Versioning:

I used IntelliJ Git plugin to control my local and remote GitHub Repository.

### Comments:

Tag v1 - successfully migrated the project from Play framework (Java) into JavaScript

Tag v2 - final release, all requirement met

| Grade Range | Requirements | Complete |
| ----------- | ------------ | -------- |
| Baseline | Member model: name, email, password, address, gender, height, startingweight; Assessment consisting of weight, chest, thigh, upper arm, waist, hips. Multiple Assessments associated with single user. Form to add more assessments in UX; List of all assessments, Current BMI | OK |
| Good | Signup + Login forms allowing new members to singup. Account Settings View allowing user to change details; Trainer Accounts (preloaded from json). Trainer logs in and can see member list. Trainer can then see assessments for a user and can comment on an assessment; Dashboard shows assessments for logged in user, including comment field; BMI Category, Ideal Body Weight; basic git repo | OK | 
| Excellent | Members can delete individual assessments; Trainers can delete any user; Date/Time for each assessment; Goals: Future date, measurement; Trend via simple red/ green label; git repo with version history | OK |
| Outstanding | Show Goal Status prominently on login; Trainer can set Goals for a Member; Assessment always listed in reverse chronological order; Goal Status: open (future), achieved, missed; Goal Summary (nmr. achieved / missed); git repo with version history + tagged releases | OK |

### Resources:

- I re-used most of the logic from Web Development assignment and successfully migrated the app from Play Framework (Java) to ExpressJS (JavaScript)

- I implemented Goals functionality as per Outstanding requirements
  - Both member and trainer can add individual goals with the following information :goal due date, goal target, goal category: weight, chest etc.)
  - The Goal will have a direction / trend indicator initialised upon creation
  - The Goal will be automatically set to 'Missed' if the due date is not a future date
  - Each time the dashboard is loaded, an automated process is run to check if any of the current open goals should have the status changed to 'Missed'
  - Each time the new assessment is added, an automated process is run to check if any of the current open goals should have the status changed to 'Completed'
  - Goals section shows current progress (percentage of goals completed / percentage of goals in progress)
  - Goals section is divided into three tabs: completed cards, open cards, missed cards
  - Each Goal card contains a detailed information about the Goal, including the latest update (i.e. completed 3 days ago)
  
- I followed the below solution and registered custom helper function that allowed me to use logical operator in handlebars
  - custom helper function implementation to use logical operator
  - https://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional/16315366#16315366
  
- I reviewed the below tutorial to see how to work with Date objects in JavaScript (compare dates, format output etc.)
  - custom helper function to display Date in the following format: dd-mmm-yyyy hh:mm:ss
  - https://www.w3schools.com/js/js_date_methods.asp
  
- I followed the below example to sort Assessments by Date in reverse chronological order
  - https://en.proft.me/2015/11/14/sorting-array-objects-number-string-date-javascrip/
  ```
  const sorted = member.assessments.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date);
        });
  ```
- I tried to explore and include different types of elements from the Semantic UI, examples:
  - Semantic accordion element to be able to group, expand, and collapse the cards with goals
  - https://semantic-ui.com/modules/accordion.html
  - Semantic cards to display detailed information about the goal
  - https://semantic-ui.com/views/card.html
  - Semantic progress bar to display the percentage of completed / open goals
  - https://semantic-ui.com/modules/progress.html