var isWageClick = null
var isTransferValueClick = null
var isRealeaseClauseClick = null

// To save the symbol of the currency use by the user 
function currencyUse(finalData) {
    for(var k in finalData) {
        if (finalData[k].Wage !== '-' & finalData[k].Wage !== undefined) {                  
            return finalData[k].Wage.match(/[$€£¥₽$¥]/g)[0]
        }
    }
    return ''
}

$(document).on("click","th", function () {
    var isWageWriteSalary = false 
    breakme: if ($(this).attr("data-field") === "Wage" | $(this).attr("data-field") === "Salary") {
        const tempObj = {}
        var finalData = []
        $("table").attr("data-page-size","unlimited");

        var data = $('#playersTable tr').map(function(index, elem) {
            $("th .th-inner", this).each(function() {
                if ($(this).text() == "Salary") {
                    isWageWriteSalary = true 
                } 
            })
            $("th",this).each(function() { 
                tempObj[`${$(this).attr("data-field")}`] = "none"
            })
            
            var copyTempObj = {...tempObj} 
            var array = []

            $("td",this).each(function(ind, elem) { 
                array.push($(this).text())
            })
            var index = 0
            for(var key in copyTempObj) {
                copyTempObj[key] = array[index]
                index++
            }
            finalData.push(copyTempObj) 
    
        });

        try {
            currencyUse = currencyUse(finalData)
        } catch(e){
            //
        }     

        // To save the type of wages (p/w, p/m, p/y)
        var timeWage = () => {
            for(var k in finalData) {
                if (finalData[k].Wage !== '-' & finalData[k].Wage !== undefined) {
                    return `${finalData[k].Wage}`.match(/[a-z/]/g).join("") 
                }
            }

            return ''
        }

        timeWage = timeWage()


        /*  
        In case the file is only showing national team, the wage/salary is always show as "-". Thus, no sorting is necessary.
        */        
        if (currencyUse === '' | timeWage === '') {
            isWageClick = isWageClick ? false : true 
            isTransferValueClick = null 
            break breakme ; 
        }

        // We extract the "real" number from the column 
        finalData.sort((a,b) => {
            a.Wage = Number(`${a.Wage}`.replace(/[^\d]/g, ''))
            b.Wage = Number(`${b.Wage}`.replace(/[^\d]/g, ''))
            return a.Wage - b.Wage});
        
        for(var k in finalData) {
            // We add comas to better visibility
            finalData[k].Wage = (finalData[k].Wage.toString()).split('').reverse().join("").match(/.{1,3}/g).join(',').split('').reverse().join('')
            // Then we add currencySymbol + timeWage (p/w, p/m, p/y...)
            finalData[k].Wage = currencyUse + finalData[k].Wage + timeWage   
        }
        
        if (isWageClick === false | null ) {
            isWageClick = true
        } else {
            finalData.reverse()
            isWageClick = false
        }

        isTransferValueClick = null 
        isRealeaseClauseClick = null
        
    
    } else if ($(this).attr("data-field") === "Transfer Value") {
        const tempObj = {}
        var finalData = []

        //Getting the data back into an array of object 
        var data = $('#playersTable tr').map(function(index, elem) {
            $("th .th-inner", this).each(function() {
                if ($(this).text() == "Salary") {
                    isWageWriteSalary = true 
                } 
            })
            $("th",this).each(function() { 
                tempObj[`${$(this).attr("data-field")}`] = "none"
            })
            
            var copyTempObj = {...tempObj} 
            var array = []

            $("td",this).each(function() { 
                array.push($(this).text())
            })
            var index = 0
            for(var key in copyTempObj) {
                copyTempObj[key] = array[index++]
            }
            finalData.push(copyTempObj)
        });


        // Data to sorted data
        finalData.sort((a,b) => {
            // Replace the number with the letters to the "real" number 
            // Example N°1 : 6.5K => 6500
            // Example N°2 : 1.3M => 1300000
            var letterToNumber = (val) => {
                if (val.includes('K')) {
                    val = Number(val.replace("K", ''))*1000
                } else if (val.includes('M')) {
                    val = Number(val.replace("M", ""))*1000000
                }
                return val
            }
            /*
            For each line, we only take the Transfer Value columns. 
            We split it to only take the lower value. 
            We delete the currency symbol. 
            And then, we use letterToNumber function to use the "real" number
            */ 
            temp_a = letterToNumber(`${a["Transfer Value"]}`.split('-')[0].replace(/[$€£¥₽$¥ ]/g, ""))
            temp_b = letterToNumber(`${b["Transfer Value"]}`.split('-')[0].replace(/[$€£¥₽$¥ ]/g, ""))

            return temp_a-temp_b
        });

        
        // Used to reverse (or not) the data for desc and asc ordering
        if (isTransferValueClick === false | null) {
            finalData.reverse()
            isTransferValueClick = true
        } else {
            isTransferValueClick = false
        }

        isWageClick = null
        isRealeaseClauseClick = null

    // In case we order by min fee rls
    } else if ($(this).attr("data-field") === "Min Fee Rls") {
        const tempObj = {}
        var finalData = []
        var data = $('#playersTable tr').map(function(index, elem) {
            $("th .th-inner", this).each(function() {
                if ($(this).text() == "Salary") {
                    isWageWriteSalary = true
                }
            })
            $("th",this).each(function() {
                tempObj[`${$(this).attr("data-field")}`] = "none"
            })

            var copyTempObj = {...tempObj}
            var array = []

            $("td",this).each(function() {
                array.push($(this).text())
            })
            var index = 0
            for(var key in copyTempObj) {
                copyTempObj[key] = array[index++]
            }
            finalData.push(copyTempObj)
        });

        console.log(finalData)

        // Data to sorted data
        finalData.sort((a, b) => {
            const letterToNumber = (val) => {
                if (val !== "-") {
                    val = val.replace('£', '');

                    if (val.includes('K')) {
                        val = Number(val.replace("K", '')) * 1000;
                    }
                    else if (val.includes('M')) {
                        val = Number(val.replace("M", '')) * 1000000;
                    } else {
                        val = Number(val);
                    }
                }
                return val;
            };

            return letterToNumber(`${a["Min Fee Rls"]}`.slice(1)) - letterToNumber(`${b["Min Fee Rls"]}`.slice(1));
        });

        finalData.forEach((el) => {console.log(el['Name'], el['Min Fee Rls'])})


        // Used to reverse (or not) the data for desc and asc ordering
        if (isRealeaseClauseClick === false | null) {
            finalData.reverse()
            isRealeaseClauseClick = true
        } else {
            isRealeaseClauseClick = false
        }

        isWageClick = null
        isTransferValueClick = null


    } else {
        isWageClick = null
        isTransferValueClick = null
        isRealeaseClauseClick = null
    }


    //Replace the "wage" key into "salary" to leave the th as it was.
    if (isWageWriteSalary) {
        finalData = finalData.map(({
            Wage: Salary,
            ...rest
        }) => ({
            Salary,
            ...rest
        }))
    }


    // We put back the data in the HTML table 
    initializeBootstrapTable(finalData);

    // Used to change the class of the Wage's th or Transfer Value's th to update the tiny symbol
    $('#playersTable tr').each(function() {
        $("th",this).each(function() { 
            if ($(this).attr("data-field") == "Wage") {
                $(".th-inner", this).each(function() {
                    if (isWageClick === false) {
                        $(this).attr('class', "th-inner sortable both desc")
                    } else if (isWageClick){
                        $(this).attr('class', "th-inner sortable both asc")
                    } else {
                        $(this).attr('class', "th-inner sortable both")
                    }
                })
            }

            else if ($(this).attr("data-field") == "Transfer Value") {
                $(".th-inner", this).each(function() {
                    if (isTransferValueClick === false) {
                        $(this).attr('class', "th-inner sortable both asc")
                    } else if (isTransferValueClick) {
                        $(this).attr('class', "th-inner sortable both desc")
                    } else {
                        $(this).attr('class', "th-inner sortable both")
                    }
                })
            }

            else if ($(this).attr("data-field") == "Min Fee Rls") {
                $(".th-inner", this).each(function() {
                    if (isRealeaseClauseClick === false) {
                        $(this).attr('class', "th-inner sortable both asc")
                    } else if (isRealeaseClauseClick) {
                        $(this).attr('class', "th-inner sortable both desc")
                    } else {
                        $(this).attr('class', "th-inner sortable both")
                    }
                })
            }
        }) 
    })

});

