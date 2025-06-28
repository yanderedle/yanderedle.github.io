let characters=[],targetCharacter=null,guessCount=0;const MAX_GUESSES=10;function seededRandom(e){let t=1e4*Math.sin(e++);return t-Math.floor(t)}function getDailySeed(){let e=new Date;return 1e4*e.getFullYear()+(e.getMonth()+1)*100+e.getDate()}function getDailyCharacter(e){let t=e.filter(e=>"202X"===e.time),a=getDailySeed(),r=Math.floor(seededRandom(a)*t.length);return t[r]}async function preloadImages(e){let t=e.map(e=>new Promise((t,a)=>{let r=new Image;r.onload=()=>t(),r.onerror=()=>{console.warn(`Failed to load image for ${e.name}`),t()},r.src=e.imageUrl}));await Promise.all(t)}function updateCountdown(){let e=new Date,t=new Date(e.getFullYear(),e.getMonth(),e.getDate()+1),a=t-e;document.getElementById("countdown").textContent=`${Math.floor(a/36e5)}h ${Math.floor(a%36e5/6e4)}m ${Math.floor(a%6e4/1e3)}s`}function resetGame(){document.getElementById("mode-selection").style.display="flex",document.getElementById("timer").style.display="block",document.getElementById("game-area").style.display="none",guessesDiv.innerHTML="",guessCount=0,timeFilter202X="true"===localStorage.getItem("timeFilter202X"),timeFilter1980s="true"===localStorage.getItem("timeFilter1980s"),document.getElementById("filter-202x").checked=timeFilter202X,document.getElementById("filter-1980s").checked=timeFilter1980s}async function startGame(e){try{document.getElementById("mode-selection").style.display="none",document.getElementById("timer").style.display="none",document.getElementById("game-area").style.display="block",guessCount=0,guessesDiv.innerHTML="",guessInput.value="";let t=document.getElementById("mode-indicator");"free"===e&&(timeFilter202X||timeFilter1980s)?t.textContent=`- You are playing ${timeFilter202X?"202X":"1980s"} only mode!`:t.textContent="";let a=await initializeGame("free"===e);if(!a||!targetCharacter)throw Error("Game failed to initialize properly")}catch(r){console.error("Error starting game:",r),alert("Error starting game. Please try again."),resetGame()}}let timeFilter202X="true"===localStorage.getItem("timeFilter202X"),timeFilter1980s="true"===localStorage.getItem("timeFilter1980s");function toggleTimeFilter(e){"202X"===e?timeFilter1980s=!(timeFilter202X=!timeFilter202X)&&timeFilter1980s:timeFilter202X=!(timeFilter1980s=!timeFilter1980s)&&timeFilter202X,document.getElementById("filter-202x").checked=timeFilter202X,document.getElementById("filter-1980s").checked=timeFilter1980s,localStorage.setItem("timeFilter202X",timeFilter202X),localStorage.setItem("timeFilter1980s",timeFilter1980s);let t=document.getElementById("mode-indicator");window.freePlay&&(timeFilter202X||timeFilter1980s)?t.textContent=`- You are playing ${timeFilter202X?"202X":"1980s"} only mode!`:t.textContent=""}async function initializeGame(e=!1){window.freePlay=e;try{let t=await fetch("yandere_characters.json");if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let a=await t.json(),r=characters=a.characters.map(e=>({name:e.name,gender:e.gender,class:e.class,club:e.club,persona:e.persona,crush:e.crush,overallReputation:e.reputation.overall||0,liked:e.reputation.liked||0,respected:e.reputation.respected||0,feared:e.reputation.feared||0,strength:e.strength,appears:e.appears,time:e.time,imageUrl:e.imageUrl.split("/revision")[0]}));if(e?timeFilter202X?r=characters.filter(e=>"202X"===e.time):timeFilter1980s&&(r=characters.filter(e=>"1980s"===e.time)):r=characters.filter(e=>"202X"===e.time),0===r.length)throw Error("No characters available with current filters");if(!(targetCharacter=e?r[Math.floor(Math.random()*r.length)]:getDailyCharacter(characters)))throw Error("Failed to select target character");return await preloadImages(characters),!0}catch(i){return console.error("Error loading character data:",i),alert("Error loading character data: "+i.message),!1}}document.addEventListener("DOMContentLoaded",()=>{document.getElementById("filter-202x").checked=timeFilter202X,document.getElementById("filter-1980s").checked=timeFilter1980s}),window.debugNewGame=function(){if(!characters||0===characters.length){console.error("Game not initialized yet!");return}let e=Math.floor(Math.random()*characters.length);return targetCharacter=characters[e],guessCount=0,guessesDiv.innerHTML="",console.log("Debug: New game started with random character"),"New game started! Make your guesses..."},setInterval(updateCountdown,1e3),updateCountdown();const guessInput=document.getElementById("guessInput"),characterList=document.getElementById("characterList"),guessesDiv=document.getElementById("guesses");function compareAttributes(e,t){let a=[],r=["overallReputation","liked","respected","feared"];for(let[i,s]of Object.entries(e)){if("name"===i)continue;let l;if(r.includes(i)){let n=Math.abs(parseFloat(s)-parseFloat(t[i]));l=0===n?"match":n<=25?"close":"no-match"}else l=s===t[i]?"match":"no-match";a.push({attribute:i,value:s,status:l})}return a}function addFooter(){let e=document.querySelector(".footer-text");e&&e.remove();let t=document.createElement("p");t.className="footer-text",t.textContent="Created by @emmeff | Made with love | Not affiliated with Yandere Simulator",document.body.appendChild(t)}function revealTargetCharacter(){let e=document.createElement("div");e.className="guess";let t=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase()),a=Object.entries(targetCharacter).filter(([e])=>"imageUrl"!==e&&"name"!==e).map(([e,a])=>`
            <div class="attribute">
                <span>${t(e)}: ${a}</span>
            </div>
        `).join("");if(window.freePlay){let r=document.createElement("button");r.textContent="Play Again",r.onclick=()=>{startGame("free")},r.style.marginTop="20px",e.innerHTML=`
            <h3 style="text-align: center; margin-bottom: 1rem;">Game Over! The character was:</h3>
            <div style="display: flex; gap: 2rem; align-items: start; padding: 0.5rem;">
                <div style="flex-shrink: 0;">
                    <img src="${targetCharacter.imageUrl}" alt="${targetCharacter.name}" class="character-image">
                    <h3 style="text-align: center; margin-top: 0.5rem;">${targetCharacter.name}</h3>
                </div>
                <div class="attributes-container" style="flex-grow: 1;">
                ${a}
            </div>
        `,e.appendChild(r)}else{let i=document.createElement("button");i.textContent="Try Free Play Mode",i.onclick=()=>startGame("free"),i.style.marginTop="20px",e.innerHTML=`
            <div class="guess-header">
                <h3>Game Over! The character was:</h3>
                <img src="${targetCharacter.imageUrl}" alt="${targetCharacter.name}" class="character-image">
                <h3>${targetCharacter.name}</h3>
            </div>
            <div class="attributes-container">
                ${a}
            </div>
            <p style="margin-top: 15px;">Want to keep playing? Try Free Play Mode!</p>
        `,e.appendChild(i)}guessesDiv.insertBefore(e,guessesDiv.firstChild)}function createGuessElement(e,t){let a=document.createElement("div");a.className="guess";let r=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase());return a.innerHTML=`
        <div class="guess-header" style="display: flex; align-items: center; gap: 1rem;">
            <img src="${e.imageUrl}" alt="${e.name}" class="character-image">
            <h3>${e.name}</h3>
        </div>
        <div class="attributes-container" style="margin-top: 1rem;">
            ${t.map(e=>"imageUrl"!==e.attribute?`
                    <div class="attribute">
                        <span class="${e.status}">
                            ${r(e.attribute)}: ${e.value}
                        </span>
                    </div>
                `:"").join("")}
        </div>
    `,a}function createConfetti(e){let t=["#ff1493","#00ff9d","#ffb700","#ff69b4","#ffffff"],a=e.getBoundingClientRect(),r=a.left+a.width/2,i=a.top+a.height/2;for(let s=0;s<50;s++){let l=document.createElement("div");l.className="confetti",l.style.left=`${r}px`,l.style.top=`${i}px`;let n=360*Math.random()*(Math.PI/180),o=100+200*Math.random(),c=Math.cos(n)*o,m=Math.sin(n)*o,d=720*Math.random()-360;l.style.backgroundColor=t[Math.floor(Math.random()*t.length)],l.style.setProperty("--tx",`${c}px`),l.style.setProperty("--ty",`${m}px`),l.style.setProperty("--r",`${d}deg`),l.style.animation=`confettiExplode ${1+Math.random()}s ease-out`,l.style.animationDelay=.2*Math.random()+"s",document.body.appendChild(l),setTimeout(()=>l.remove(),2e3)}}function displayGuessResults(e,t,a){let r=document.createElement("div");r.className="guess",e.name===targetCharacter.name&&r.classList.add("correct");let i=e=>e.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase());r.innerHTML=`
        <div style="display: flex; gap: 2rem; align-items: start; padding: 0.5rem;">
            <div style="flex-shrink: 0;">
                <img src="${e.imageUrl}" alt="${e.name}" class="character-image">
                <h3 style="text-align: center; margin-top: 0.5rem;">${e.name}</h3>
            </div>
            <div class="attributes-container" style="flex-grow: 1;">
            ${t.map(e=>"imageUrl"===e.attribute||"time"===e.attribute&&(timeFilter202X||timeFilter1980s)||"time"===e.attribute&&!a?"":`
                    <div class="attribute">
                        <span class="${e.status}">
                            ${i(e.attribute)}: ${e.value}
                        </span>
                    </div>
                `).join("")}
        </div>
    `,guessesDiv.insertBefore(r,guessesDiv.firstChild),addFooter(),e.name===targetCharacter.name?(createConfetti(r),setTimeout(()=>{if(a){let e=document.createElement("div");e.className="modal-overlay",e.style.display="flex",e.innerHTML=`
                    <div class="congrats-modal">
                        <h2>Thanks for playing!</h2>
                        <img src="${targetCharacter.imageUrl}" alt="${targetCharacter.name}" class="character-image" style="margin: 1rem 0">
                        <p style="margin: 1.5rem 0">In free play${timeFilter202X?" (202X only)":timeFilter1980s?" (1980s only)":""} mode, it took ${guessCount} ${1===guessCount?"guess":"guesses"} to find <b>${targetCharacter.name}</b>! Thanks for playing Yanderedle!</p>
                        <div class="modal-buttons">
                            <button onclick="startGame('free'); this.closest('.modal-overlay').remove()">Play Again</button>
                            <button onclick="this.closest('.modal-overlay').remove()">Close</button>
                        </div>
                        <div class="modal-footer">yanderedle.github.io</div>
                    </div>
                `,document.body.appendChild(e)}else{let t=document.createElement("div");t.className="modal-overlay",t.style.display="flex",t.innerHTML=`
                    <div class="congrats-modal">
                        <h2>Thanks for playing!</h2>
                        <p style="margin: 1.5rem 0">You completed the daily challenge in ${guessCount} ${1===guessCount?"guess":"guesses"}. Thanks for playing Yanderedle!</p>
                        <div class="modal-buttons">
                            <button onclick="this.closest('.modal-overlay').remove()">Close</button>
                            <button onclick="this.closest('.modal-overlay').remove(); startGame('free')">Free Play</button>
                        </div>
                        <div class="modal-footer">yanderedle.github.io</div>
                    </div>
                `,document.body.appendChild(t)}},1e3)):guessCount>=10&&revealTargetCharacter()}function makeGuess(){if(!targetCharacter||0===characters.length){alert("Please wait for the game to finish loading...");return}let e=guessInput.value.trim(),t=characters.find(t=>t.name.toLowerCase()===e.toLowerCase());if(!t){console.log("Attempted guess:",e),console.log("Available characters:",characters.map(e=>e.name)),alert("Character not found! Please select a character from the dropdown list.");return}guessCount++;let a=compareAttributes(t,targetCharacter);displayGuessResults(t,a,freePlay),guessInput.value="",characterList.style.display="none"}function selectCharacter(e){guessInput.value=e,characterList.style.display="none"}addFooter(),guessInput.addEventListener("input",()=>{let e=guessInput.value.toLowerCase();if(!e){characterList.style.display="none";return}let t=characters;window.freePlay?timeFilter202X?t=characters.filter(e=>"202X"===e.time):timeFilter1980s&&(t=characters.filter(e=>"1980s"===e.time)):t=characters.filter(e=>"202X"===e.time);let a=t.filter(t=>t.name.toLowerCase().includes(e)).slice(0,5);a.length?(characterList.innerHTML=a.map(e=>`
                <div class="character-option" onclick="selectCharacter('${e.name}')">
                    <img src="${e.imageUrl}" alt="${e.name}" onerror="this.src='https://yanderesimulator.com/img/favicon.png'">
                    <div class="character-info">
                        <div class="character-name">${e.name}</div>
                    </div>
                </div>
            `).join(""),characterList.style.display="block"):characterList.style.display="none"}),guessInput.addEventListener("keypress",e=>{"Enter"===e.key&&makeGuess()});