$(document).ready(function() {
    console.log("Dom loaded");

    var initPage = 0 
    loadSeedData();
    handleSelection();
    updateUIFromStoredSelection();
    updateSelectedRolesSummary();
    roleFilterEventListener();
    assignClearButton();
    editInit();
    setupFileChangeListener();
    setupCalculateButtonListener(initPage);
    toggleThemeListener();
    assignResetButton();




});