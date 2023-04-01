if (window.location.host === '203.151.205.45' || window.location.host === '203.151.205.33') {
    const xhr = new XMLHttpRequest();
    const url = 'resp-log.json';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };
    
    const json_str = JSON.stringify({
        referenceNo: 'your_reference_no',
        amount: 'your_amount'
    });

    xhr.send(json_str);
} else {
    console.log('Access Denied');
}