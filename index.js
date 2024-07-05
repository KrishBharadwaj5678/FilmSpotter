let search_btn=document.querySelector("button.btn-search");
let movie=document.querySelector("input.movie-name");
let release=document.querySelector("input.release-year");
let invalid=document.querySelector("h4.invalid");
let output=document.querySelector("div.output");
let poster=document.querySelector("img.movie-image");
let main=document.querySelector("div.main");

let t=gsap.timeline();

t.from("div.main",{
    y:-50,  
    opacity:0,
    duration:1
})

t.from("h3.top-head,p.para,input.movie-name,input.release-year",{
    opacity:0,
    stagger:0.2,
    y:-15
})

t.from(search_btn,{
    display:"none",
    y:30,
    background:"#201F28"

})

let addData=(data)=>{
   console.log(data);

   main.style.paddingBottom=`1.6vw`;
   output.style.display="block";
    // Movie Image
   poster.style.display="block";
   t.from(poster,{
        opacity:0,
        x:-10
    })
    let poster_img=`${data["Poster"]}`;
    if(poster_img=="N/A"){
      poster_img="notfound.jpeg";
    }
   poster.src=`${poster_img}`;

   let imdbrating=`${data["imdbRating"]}`;
   if(imdbrating=="N/A"){
    imdbrating="N/A"
   }else{
     imdbrating=`${imdbrating}/10`;
   }

   let metascore=`${data["Metascore"]}`;
   if(metascore=="N/A"){
    metascore="N/A"
   }else{
    metascore=`${metascore}/100`;
   }

   let revenue=`${data["BoxOffice"]}`;
   if(revenue=="undefined"){
     revenue="N/A";
   }

   output.innerHTML=`
        <div class="box">
            <p class="title">Title</p>
            <p class="subtitle">${data["Title"]}</p>
        </div>

        <div class="box">
            <p class="title">Released</p>
            <p class="subtitle">${data["Released"]}</p>
        </div>

        <div class="box">
            <p class="title">Director</p>
            <p class="subtitle">${data["Director"]}</p>
        </div>

        <div class="box">
            <p class="title">Writer</p>
            <p class="subtitle">${data["Writer"]}</p>
        </div>

        <div class="box">
            <p class="title">Cast</p>
            <p class="subtitle">${data["Actors"]}</p>
        </div>

        <div class="box">
            <p class="title">Duration</p>
            <p class="subtitle">${data["Runtime"]}</p>
        </div>

        <div class="box">
            <p class="title">Origin</p>
            <p class="title">${data["Country"]}</p>
        </div>

        <div class="box">
            <p class="title">Revenue</p>
            <p class="subtitle">${revenue}</p>
        </div>

        <div class="box">
            <p class="title">Accolades</p>
            <p class="subtitle">${data["Awards"]}</p>
        </div>

        <div class="box">
            <p class="title">Genre</p>
            <p class="subtitle">${data["Genre"]}</p>
        </div>

        <div class="box">
            <p class="title">IMDB Rating</p>
            <p class="subtitle">${imdbrating}</p>
        </div>

        <div class="box">
            <p class="title">IMDB Votes</p>
            <p class="subtitle">${data["imdbVotes"]}</p>
        </div>

        <div class="box">
            <p class="title">Metacritic Rating</p>
            <p class="subtitle">${metascore}</p>
        </div>

        <div class="box2">
            <p class="plot">Plot:</p>
            <p class="plot-desc">${data["Plot"]}</p>
        </div>`;

        // Adding Scroll Trigger Effect in Movie Information
        if(window.innerWidth>=1250 && window.innerHeight>=700){
            t.from("div.box,div.box2",{
                opacity:0,
                x:-10,
                stagger:0.2,
                scrollTrigger:{
                    trigger:"div.box,div.box2",
                    scroller: "body",
                    scrub: 4,
                    start: "top 74%",
                    end: "top 0%"
                }
            })
        }
        else{
            t.from("div.box,div.box2",{
                opacity:0,
                x:-10,
                stagger:0.2,
            })
        }
       

}

search_btn.addEventListener("click",()=>{
    let movie_name=movie.value;
    let release_year=release.value;
    // Checking that the movie name field should be filled and release year can either contain no value or 4 digit value
    if(movie_name.length>=1 && release_year.length==0 || release_year.length==4){
        t.to("h4.invalid",{
            opacity:0,
            display:"none"
        })

        async function GetMovie(){
            if(release_year.length!=4){
                let url=await fetch(`https://www.omdbapi.com/?t=${movie_name}&plot=full&apikey=96ed9186`);
                let data=await url.json();
                if(data["Response"]=="False"){
                   // Invalid Movie Name 
                    t.to("h4.invalid",{
                        opacity:1,
                        display:"flex",
                        duration:2,
                        text:"Movie Not Found :(",
                    })
                }
                else{
                   // Valid Movie Name
                    t.to("h4.invalid",{
                        opacity:0,
                        display:"none",
                        text:""
                    })

                    addData(data);
                }

             }
             else{
                let url=await fetch(`https://www.omdbapi.com/?t=${movie_name}&y=${release_year}&plot=full&apikey=96ed9186`);
                let data=await url.json();
                // Invalid Movie Name and Year
                if(data["Response"]=="False"){
                    t.to("h4.invalid",{
                        opacity:1,
                        display:"flex",
                        duration:2,
                        text:"Movie Not Found :(",
                    })
                }
                else{
                    // Valid Movie Name and Year
                    t.to("h4.invalid",{
                        opacity:0,
                        display:"none",
                        text:""
                    })

                    addData(data);

                }

             }
            
        }
        GetMovie()

    }
    // Checking that the movie name should not be empty
    else if(movie_name.length==0){
        invalid.innerText="";
        t.to("h4.invalid",{
            opacity:1,
            display:"flex",
            duration:2,
            text:"Invalid Movie Name"
        })
    }
    // Checking that the movie release year should contain only 0 or 4 digits
    else if(release_year.length!=0 || release_year.length!=4){
        invalid.innerText="";
        t.to("h4.invalid",{
            opacity:1,
            display:"flex",
            duration:2,
            text:"Enter a Valid Year"
        })
    }

})
