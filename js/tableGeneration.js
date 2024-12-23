function initializeBootstrapTable(data, initPage) {

    data = data.filter((obj) => function() {
        for(const [key, value] of Object.entries(obj)) {
            if (value === undefined | value === "-") {
                return False 
            }
        }
        return True
    })

    var useWageTitle = data.some((obj) => obj.Wage !== undefined) ; 
 
    if (initPage === 0) {
        var columns = [
            { field: 'CA', title: 'CA', sortable: true},
            { field: "PA", title: 'PA', sortable: true },
            {
                field: 'Wage',
                title: useWageTitle ? 'Wage' : 'Salary',
                sortable: true,
                formatter: function (value, row) {
                    return row.Wage || row.Salary;
                }
            },
            { field: 'Name', title: 'Name', sortable: true },
            { field: 'Age', title: 'Age', sortable: true },
            { field: 'Club', title: 'Club', sortable: true},
            { field: 'Transfer Value', title: 'Transfer Value', sortable: true },
            { field: 'Min Fee Rls', title: 'Min Fee Rls', sortable: true},
            { field: 'Nationality', title: 'Nat', titleTooltip: 'Nationality', sortable: true },
            { field: 'Position', title: 'Position', sortable: true }
        ];
    
        //Init
        // Retrieve selectedRoles from localStorage and append as dynamic columns
        var selectedRoles = JSON.parse(localStorage.getItem('selectedRoles')) || [];
        selectedRoles.forEach(function (role) {
            columns.push({ field: role.code, title: role.code, sortable: true, titleTooltip: role.name });
        });

        columns.push(
            { field: 'HighestScore', title: 'Highest Role Score', sortable: true },
            { field: 'HighestScoringRole', title: 'Resulting Role', sortable: true }
        );
        initPage = 1 
    } else {
        var columns = []
        for(const [key, value] of Object.entries(data[0])) {
            if (key === "Wage" | key === "Salary") {
                columns.push({
                    field: 'Wage',
                    title: useWageTitle ? 'Wage' : 'Salary',
                    sortable: true,
                    formatter: function (value, row) {
                        return row.Wage || row.Salary;
                    }
                })
            } else {
                columns.push({ field: key, title: key, sortable: true })
            }
        }
    }


    var $table = $('#playersTable')

    if ($table.bootstrapTable('getData').length > 0 || $table.data('bootstrap.table')) {
        $table.bootstrapTable('destroy');
    }

    data = data.filter(element => element.Name && element.Name !== "-" && element.Name !== "undefined");
    console.log(data)

    $table.bootstrapTable({
        data: data,
        columns: columns,
        pageSize: data.length
    });

    $(function () {
        $('#toolbar').find('select').change(function () {
            $table.bootstrapTable('destroy').bootstrapTable({
                exportDataType: $(this).val(),
                exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
                columns: columns,
                data: data,
                pageSize: data.length
            })
        }).trigger('change')
    })
}