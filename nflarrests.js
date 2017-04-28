(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
    var cols = [
        { id : "Date", alias : "DateOfEncounter", dataType : tableau.dataTypeEnum.date },
        { id : "Team", alias : "TeamID", dataType : tableau.dataTypeEnum.string },
        { id : "Team_name", alias : "TeamName", dataType : tableau.dataTypeEnum.string },
        { id : "Team_city", alias : "TeamCity", dataType : tableau.dataTypeEnum.string },
        { id : "Name", alias : "PlayerName ", dataType : tableau.dataTypeEnum.string },
        { id : "Position", alias : "PlayerPosition", dataType : tableau.dataTypeEnum.string },
        { id : "Encounter", alias : "EncounterType", dataType : tableau.dataTypeEnum.string },
        { id : "Category", alias : "EncounterReason", dataType : tableau.dataTypeEnum.string },
        { id : "Description", alias : "Details", dataType : tableau.dataTypeEnum.string },
    ];
    var tableInfo = {
        id : "nflarrestsfeed",
        alias : "NFL Arrests",
        columns : cols
    };

    schemaCallback([tableInfo]);
};

    myConnector.getData = function(table, doneCallback) {
    var teamObj = JSON.parse(tableau.connectionData),
        teamString = teamObj.team,
        apiCall = "http://nflarrest.com/api/v1/team/arrests/" + teamString;
    $.getJSON(apiCall, function(resp) {
        var array = resp,
            tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = array.length; i < len; i++) {
            tableData.push({
                "Date": array[i].Date,
                "Team": array[i].Team,
                "Team_name": array[i].Team_name,
                "Team_city": array[i].Team_city,
                "Name": array[i].Name,
                "Position": array[i].Position,
                "Encounter": array[i].Encounter,
                "Category": array[i].Category,
                "Description": array[i].Description,
            });
        }

        table.appendRows(tableData);
        doneCallback();
    });
};

   tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            var teamObj = {
                team: $('#team-input').val()
            };


                tableau.connectionData = JSON.stringify(teamObj); // Use this variable to pass data to your getSchema and getData functions
                tableau.connectionName = "NFL Arrests Data"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            
        });
    });
})();
