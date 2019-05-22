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
${LANDING_PAGE_URL}     https://s.rytmi.codento.com/home
${ADD_SKILL_CHECK}      Add a new skill
${MODIFYING_PROFILE}    Basic Details
${ACCOUNT_DROPDOWN_ID}  account-dropdown__BV_toggle_
${ACCOUNT_EDIT_ID}      account-dropdown-item-edit
${LINK_INPUT_ID}        linkInput
${ADD_LINK_BUTTON_ID}   add
${REMOVE_LINK_XPATH}    //*[@id="editLinks"]/div/div/ul/li/span
${TEST_LINK}            http://robotframework.org/Selenium2Library/Selenium2Library.html
*** Settings ***
Library         SeleniumLibrary
Suite Teardown  Close Browser

*** Test Cases ***
Login Functionality Test
    Open Browser To Login Page
    Login With Credentials  ${USER}  ${PASS}
Test Add Link
    Modify Links

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

Modify Links
    Click Element           id=${ACCOUNT_DROPDOWN_ID}
    Click Element           id=${ACCOUNT_EDIT_ID}
    Page Should Contain     ${MODIFYING_PROFILE}
    Input Text              id=${LINK_INPUT_ID}  ${TEST_LINK}
    Click Button            id=${ADD_LINK_BUTTON_ID}
    Page Should Contain     ${TEST_LINK}

    # Remove the added link
    Click Element             xpath=${REMOVE_LINK_XPATH}
    Page Should Not Contain   ${TEST_LINK}

Go To Landing Page
    Go To   ${LANDING_PAGE_URL}

Login Was Successful
    Page Should Contain         ${LOGIN_SUCCESS_CHECK}

Teardown
    Close All Browsers
