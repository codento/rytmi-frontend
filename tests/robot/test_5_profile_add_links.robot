*** Variables ***
${URL}                  https://s.rytmi.codento.com/home
${BROWSER}              Firefox
${DELAY}                0.5
${PAGE_TITLE}           Rytmi
${USER}                 user
${PASS}                 pass
${LOGIN_INPUT_USER}     identifierId
${LOGIN_NEXT_BTN}       identifierNext
${LOGIN_INPUT_PASS}     password
${LOGIN_SUBMIT_BTN}     passwordNext
${LOGIN_SUCCESS_CHECK}  Consultants
${LANDING_PAGE_URL}     https://s.rytmi.codento.com/home
${ADD_SKILL_CHECK}      Add a new skill
*** Settings ***
Library         SeleniumLibrary
Suite Teardown  Close Browser

*** Test Cases ***
Login Functionality Test
    Open Browser To Login Page
    Login With Credentials  ${USER}  ${PASS}
Test Add Skill
    Modify Skills

*** Keywords ***
Open Browser To Login Page
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed  ${DELAY}
    Login Page Should Be Open

Login Page Should Be Open
    Title Should Be    ${PAGE_TITLE}

Login With Credentials
    [Arguments]    ${username}    ${password}
    Click Element       name=login
    Input Text          id=${LOGIN_INPUT_USER}          ${username}
    Click Element       id=${LOGIN_NEXT_BTN}
    Input Text          name=${LOGIN_INPUT_PASS}        ${password}
    Click Element       id=${LOGIN_SUBMIT_BTN}
    Login Was Successful

Modify Skills
    Click Element   xpath=/html/body/div/div/div/nav/section/ul/li[3]/a
    Page Should Contain     ${ADD_SKILL_CHECK}
    Input Text      id=__BVID__150  !ROBOT_TEST_SKILL
    Input Text      id=__BVID__151  Robot test desc
    Select From List By Index   id=__BVID__152  1
    Click Button    name=submit
    Page Should Contain !ROBOT_TEST_SKILL

Go To Landing Page
    Go To   ${LANDING_PAGE_URL}

Login Was Successful
    Page Should Contain         ${LOGIN_SUCCESS_CHECK}

Teardown
    Close All Browsers
