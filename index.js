document.addEventListener("DOMContentLoaded",function(){
    const searchbutton = document.getElementById("searchbutton");
    const usernameinput = document.getElementById("userinput");
    const statscontainer = document.querySelector(".stats");
    const easyprogress = document.querySelector(".easyprogress");
    const mediumprogress = document.querySelector(".mediumprogress");
    const hardprogress = document.querySelector(".hardprogress");
    const easylevel = document.querySelector(".easylevel");
        const mediumlevel = document.querySelector(".mediumlevel");
            const hardlevel = document.querySelector(".hardlevel");
            const statscard = document.querySelector(".statscard");
//Returns true or false
            function validateusername(username)
            {
if(username.trim()==="")
{
    alert("Username should not be empty");
    return false;
} 
const regex = /^[a-zA-Z0-9_-]{1,15}$/;
const isMatching = regex.test(username);
if(!isMatching)
{
    alert("Invalid username");
}
return isMatching;
            }
            async function fetchuserdetails(username)
            {
                 
try{
    searchbutton.textContent = "Searching..";
    searchbutton.disabled = true;
    // const response = await fetch(url);
    const proxyurl="https://cors-anywhere.herokuapp.com/";
    const targeturl = "https://leetcode.com/graphql/";
                const myHeaders = new Headers();
                myHeaders.append("content-type","application/json");
                  const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyurl+targeturl, requestOptions);
    if(!response.ok)
    {
        throw new Error("Unable to fetch the user details");
    }
    const parseddata = await response.json();
    console.log("Logging data:",parseddata);
    displayuserdata(parseddata);
}
catch(error)
{
statscontainer.innerHTML = `<p>${error.message}</p>`
}
finally{
searchbutton.textContent ="Search";
searchbutton.disabled = false;
}
            }
            function updateProgress(solved,total,level,circle)
            {
const progressDegree = (solved/total)*100;
circle.style.setProperty("--progress-degree",`${progressDegree}%`);
level.textContent =`${solved}/${total}`;
            } 
             function displayuserdata(parseddata)
            {
                const totalquestion = parseddata.data.allQuestionsCount[0].count;
                const totaleasyquestion = parseddata.data.allQuestionsCount[1].count;
                const totalmediumquestion=parseddata.data.allQuestionsCount[2].count;
                const totalhard =parseddata.data.allQuestionsCount[3].count;
                const totalsolved =parseddata.data.matchedUser.submitStats.acSubmissionNum[0].count;
                 const easysolved =parseddata.data.matchedUser.submitStats.acSubmissionNum[1].count;
                  const mediumsolved =parseddata.data.matchedUser.submitStats.acSubmissionNum[2].count;
                   const hardsolved =parseddata.data.matchedUser.submitStats.acSubmissionNum[3].count;
                   updateProgress(easysolved,totaleasyquestion,easylevel,easyprogress);
                   updateProgress(mediumsolved,totalmediumquestion,mediumlevel,mediumprogress);
                   updateProgress(hardsolved,totalhard,hardlevel,hardprogress);
                   const cardData =[{
                    level:"Overall Submissions",value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
                    {
                    level:"OverallEasy Submissions",value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
                    {
                    level:"Overall Medium Submissions",value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
                    {
                    level:"Overall Hard Submissions",value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions
                   },
                ];
                   console.log("Card Data:" ,cardData);
                   statscard.innerHTML= cardData.map(
                     data => 
                    `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
                ).join("");
                
            }
            searchbutton.addEventListener("click",function()
        {
            const username = usernameinput.value;
            console.log(username);
            if(validateusername(username))
            {
                fetchuserdetails(username);
            }
        });
});