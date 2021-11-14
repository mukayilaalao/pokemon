// add a clear button
let select=document.querySelector("#pokemon-select");
let pokeTeam=[];
let pokeRecent=[];
fetch("https://pokeapi.co/api/v2/pokemon?limit=50")
    .then((res)=>{
        return res.json();
    }).then((data)=>{
        let pokemonList = data.results;
        for(let pokemon of pokemonList){
            const {name}=pokemon;
            let option=document.createElement("option");
            option.value=name;
            option.textContent=name[0].toUpperCase()+name.slice(1);
            select.append(option);
            
        }
}).catch((err)=>{
    console.log(err);
});

/*
#header-id h1 {
    opacity: 1;
    transition: 1s;
}
#header-id h1:hover {
    opacity: .2;

}

*/
let h1=document.querySelector("#header-id h1");
h1.style.opacity=0;
h1.style.transition="5s";

setTimeout(()=>{
   h1.style.opacity=1;    
},1000)

let url="https://pokeapi.co/api/v2/pokemon/"
let form=document.querySelector("#form-id");
let details=document.querySelector("#details-id")
//create li and add two elements img and span
async function fetchingPoke(pokeName, bool) {
    
        try {
            let poke= await fetch(url+pokeName);
            var pokeReal = await poke.json();
        }
        catch(e) {
            console.log(e);
        }
       
        let hp, defense, attack;
        for(let obj of pokeReal.stats) {
            if(obj.stat.name==="hp") hp= obj.base_stat;
            else if(obj.stat.name==="attack") attack= obj.base_stat;
            else if(obj.stat.name==="defense") defense= obj.base_stat;
        }
        let pokeImage=pokeReal.sprites.front_default;
        details.innerHTML=
        `<h2>Details</h2>
        <img src=${pokeImage} alt=${pokeName} +" image">
        <div id="detail-header">
            <div>Name: ${pokeName}</div>
            <hr>
            <div>Height: ${pokeReal.height}</div>
            <hr>
            <div>Weight: ${pokeReal.weight}</div>
            <hr>
            <div>type: ${pokeReal.types.map(el=>el.type.name).join("/")}</div>
        </div>
        <div id="detail-content">
            
            <h3>Base Attributes</h3>
            <hr>
            <div >Hit Points: <span id="detail-hp">${hp}</span> </div>
            <hr>
            <div >Attack: <span id="detail-atk"">${attack}</span> </div>
            <hr>
            <div >Defense: <span id="detail-def">${defense} </span> </div>
        </div>`;
        // fectch and get the url of evolution chain
        try {
                let pokeSpecies= await fetch(pokeReal.species.url);
                var species = await pokeSpecies.json();
                let pokeChain = await fetch(species.evolution_chain.url);
                var chainResult = await pokeChain.json();
                let chainObj=chainResult.chain; //evolves_to[0].species
                let evolutions=[chainObj.species.name];
                while(true){
                    chainObj=chainObj.evolves_to[0];
                    if(!chainObj){
                        break;
                    }
                    else{
                        evolutions.push(chainObj.species.name);
                    }
                    
                }
       
        }
        catch(err) {
            console.log(err);
        }

        if(bool) {
            let img=document.createElement("img");
            let span=document.createElement("span");
            let li=document.createElement("li");
            let list=document.querySelector("#recents-list");
            span.textContent=pokeName;
            span.addEventListener("click", e=>{
                fetchingPoke(e.target.textContent, false);
            })
            img.setAttribute("src", pokeImage);
            img.setAttribute("alt", pokeName+" image");
            if(!pokeRecent.includes(pokeName.toLowerCase())) {
                li.append(img, span);
                list.append(li);
                pokeRecent.push(pokeName.toLowerCase());
            }
        }
    
        
}

form.addEventListener("submit", e=> {
    e.preventDefault();
    let selectedPokemon=e.target["pokemon-select"].value;
    fetchingPoke(selectedPokemon, true);
    
})
    


let addButton=document.querySelector("#last-button-id");

addButton.addEventListener("click", ()=>{
    let pokeName=document.querySelector("#detail-header").textContent;
    let teamImage=document.querySelector("#details-id img").src;
    let img=document.createElement("img");
    let span=document.createElement("span");
    let li=document.createElement("li");
    let list=document.querySelector("#team-list");
    let justPokeName=pokeName.trim().split(" ")[1];
    span.textContent=justPokeName;
    img.setAttribute("src", teamImage);
    img.setAttribute("alt", "pokemon team");
    if(!pokeTeam.includes(justPokeName)){
        li.append(img, span);
        list.append(li);
        pokeTeam.push(justPokeName);
        let det_hp=document.querySelector("#detail-hp");
        let det_atk=document.querySelector("#detail-atk");
        let det_def=document.querySelector("#detail-def");
        let teamHp=document.querySelector("#team-stats-hp");
        let teamAtk=document.querySelector("#team-stats-atk");
        let teamDef=document.querySelector("#team-stats-def");
        teamHp.textContent=Number(teamHp.textContent)+Number(det_hp.textContent);
        teamAtk.textContent=Number(teamAtk.textContent)+Number(det_atk.textContent);
        teamDef.textContent=Number(teamDef.textContent)+Number(det_def.textContent);
    }
    
});
let clearButton=document.querySelector("#last-button-clear");
clearButton.addEventListener("click", e=> {
    let teamHp=document.querySelector("#team-stats-hp");
    let teamAtk=document.querySelector("#team-stats-atk");
    let teamDef=document.querySelector("#team-stats-def");
    teamHp.textContent=0;
    teamAtk.textContent=0;
    teamDef.textContent=0;
    let ulList=document.querySelectorAll("#team-list li");
    ulList.forEach(li=> li.remove());
    pokeTeam=[];
})
    