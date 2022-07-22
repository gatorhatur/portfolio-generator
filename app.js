const inquirer = require('inquirer');
const fs = require('fs');
const generatePage = require('./src/page-template');


// const profileDataArgs = process.argv.slice(2);
// const [name, github] = profileDataArgs;

// fs.writeFile('./index.html', generatePage(name, github), err => {
//     if (err) throw new Error(err);
//     console.log('Portofolio complete! Check out index.html to see the output');
// });
const promptUser = () => {
    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is your name? (Required)',
                validate: userInput => {
                    if (userInput) {
                        return true;
                    }
                    else {
                        console.log("Please enter a name!");
                    }
                }
            },
            {
                type: 'input',
                name: 'github',
                message: 'Enter your GitHub Username (Required)',
                validate: userInput => {
                    if (userInput) {
                        return true;
                    }
                    else {
                        console.log("Please enter a github username!");
                    }
                }
            },
            {
                type: 'confirm',
                name: 'confirmAbout',
                message: 'Would you like to enter some information about yourself for an "About" section?',
                default: true,

            },
            {
                type: 'input',
                name: 'about',
                message: 'Provide some information about yourself',
                when: ({ confirmAbout }) => {
                    if (confirmAbout) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        ]);  
}

//promptUser().then(answers => console.log(answers));

const promptProject = portfolioData => {
    
    if (!portfolioData.projects) {
        portfolioData.projects = [];       
    }
 
    console.log(`
    =================
    Add a New Project
    =================
    `);

    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your project? (Required)',
            validate: userInput => {
                if (userInput) {
                    return true;
                }
                else {
                    console.log("Please enter a name for this project!");
                }
            }
        },
        {
            type: 'input',
            name: 'description',
            message: 'Provide a description of the project (Required)',
            validate: userInput => {
                if (userInput) {
                    return true;
                }
                else {
                    console.log("Please enter a description for this project!");
                }
            }
        },
        {
            type: 'checkbox',
            name: 'languages',
            message: 'What did you build this project with? (Check all the apply)',
            choices: ['JavaScript', 'HTML', 'CSS', 'ES6', 'jQuery', 'Bootstrap', 'Node']
        },
        {
            type: 'input',
            name: 'link',
            message: 'Enter the Github Link to your project. (Required)',
            validate: userInput => {
                if (userInput) {
                    return true;
                }
                else {
                    console.log("Please enter a link for the project!");
                }
            }
        },
        {
            type: 'confirm',
            name: 'feature',
            message: 'Would you like to feature this project?',
            default: false
        },
        {
            type: 'confirm',
            name: 'confirmAddProject',
            message: 'Would you like to add another project?',
            default: false
        }
    ])
        .then(projectData => {
            portfolioData.projects.push(projectData);
            if (projectData.confirmAddProject) {
                return promptProject(portfolioData);
            }
            else {
                return portfolioData;
            }
        });
}

promptUser()
    .then(promptProject)
    .then(portfolioData => {
        const pageHTML = generatePage(portfolioData);
        

        fs.writeFile('./index.html', pageHTML, err => {
                if (err) throw new Error(err);
                console.log('Page created! Check out index.html in this directory to see it!'); 
        });
            
    });
