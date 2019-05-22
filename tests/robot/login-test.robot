*** Variables ***
${URL}                  https://s.rytmi.codento.com/home
${BROWSER}              Firefox
${DELAY}                1
${PAGE_TITLE}           Rytmi
${USER}                 user
${PASS}                 pass
${LOGIN_INPUT_USER}     identifierId
${LOGIN_NEXT_BTN}       identifierNext
${LOGIN_INPUT_PASS}     password
${LOGIN_SUBMIT_BTN}     passwordNext
${LOGIN_SUCCESS_CHECK}  Consultants

*** Settings ***
Library         SeleniumLibrary
Suite Teardown  Close Browser

*** Test Cases ***
Login Functionality Test
    Open Browser To Login Page
    Login With Credentials  ${USER}  ${PASS}

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

Login Was Successful
    Page Should Contain         ${LOGIN_SUCCESS_CHECK}

Teardown
    Close All Browsers
