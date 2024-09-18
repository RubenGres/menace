fetch('all_states.json')
    .then((response) => response.json())
    .then((json) => console.log(json));
