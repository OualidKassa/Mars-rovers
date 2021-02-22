let store = Immutable.Map({
    user: Immutable.Map({
        name: "Futur Astronaute"
    }),
    apod: "",
    rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
});

const root = document.getElementById("root");

const updateStore = (store, newState) => {
    store = store.merge(newState);
    render(root, store);
};

const render = async (root, state) => {
    root.innerHTML = App(state);
};

const App = (state) => {
    const rovers = state.get("rovers");
    const name = store.get('user').get('name');
    if (state.get("photos")) {
        return findRoverContent(state);
    }


    return `

        <div>
        <h1>Hello ${name} Choose your rover to get informations and photos</h1>
        </div>
          <p>
            <button style="background-color: brown; border-radius: 12px;" type="button" value=${rovers.get(0)} onclick = "clickOnRover(this)">
              <h2 class="class-title">${rovers.get(0)}</h2>
            </button>
          </p>
          <p>
            <button style="background-color: #4CAF50; border-radius: 12px;"  type="button" value=${rovers.get(1)} onclick = "clickOnRover(this)">
              <h2 class="class-title">${rovers.get(1)}</h2>
            </button>
          </p>
          <p>
              <button style="background-color: chocolate; border-radius: 12px;" type="button" value=${rovers.get(2)} onclick = "clickOnRover(this)">
              <h2 class="class-title">${rovers.get(2)}</h2>
            </button>
          </p>
    `
};

window.addEventListener('load', () => {
    render(root, store)
})

const printRoverContent = (roverData, state) => {

    return `
    <div>
        <button onclick="returnMenu()" style="background-color: blueviolet">Back to menu</button>
    </div>
  <ol>
    <li>Name of rover: ${roverData.getIn(["rover", "name"])}</li>
    <li>Launch Date: ${roverData.getIn(["rover", "launch_date"])}</li>
    <li>Landing Date: ${roverData.getIn(["rover", "landing_date"])}</li>
    <li>Status: ${roverData.getIn(["rover", "status"])}</li>
    <li>Date Of Most Recent Photos Were Taken: ${roverData.get("earth_date")}</li>
  </ol>
  ${getImagesRover(state)}
  `
}

const clickOnRover = (e) => callRoverApi(e.value);

const findRoverContent = (state) => {
    const roverData = state.get("photos").find(roverData => roverData.get("rover"));
    return printRoverContent(roverData, state);
};

const returnMenu = () => {
    store = store.remove("photos");
    render(root, store);
};

const printRoversImages = (src) => `<img src="${src}">`;

const getImagesRover = (state) => {
    return (state.get("photos"))
        .slice(0, 30)
        .map(photos => printRoversImages(photos.get("img_src"))
        ).reduce((acc, curr) => acc + curr);
};

const callRoverApi = async (roverName) => {
    try {
        await fetch(`http://localhost:3000/roverInfo/${roverName}`)
            .then(res => res.json())
            .then(roverInfo => updateStore(store, roverInfo))
    } catch (error) {
        console.log("errors when call api rover:", error);
    }
};
