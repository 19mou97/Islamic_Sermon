
document.cookie = "my_cookie=value; SameSite=None; Secure";

/*Explore*/

let exploreBtn = document.querySelector('.title .btn'),
  HaditchSection = document.querySelector('.hadith');
exploreBtn.addEventListener('click',()=>{
  HaditchSection.scrollIntoView({
    behavior : "smooth"
  })
})

/* Nav change when scroll */
let fixedNav = document.querySelector('.header');
window.addEventListener("scroll",()=>{
  window.scrollY > 100 ? fixedNav.classList.add('active') : fixedNav.classList.remove('active');
})


/* Change li color when scroll up/down */
let lastScrollTop = 0;

    window.addEventListener("scroll", function() {
      let st = window.pageYOffset || document.documentElement.scrollTop;

      if (st > lastScrollTop){
        // Scrolling down
        changeColor("white");
      } else {
        // Scrolling up
        changeColor(""); // Original color
      }

      lastScrollTop = st <= 0 ? 0 : st;
    });

    function changeColor(color) {
      const listItems = document.querySelectorAll('.lists li');
      listItems.forEach(item => {
        item.style.backgroundColor = color;
      });
    }

//Hadith changer//
let hadithContainer = document.querySelector('.hadithContainer'),
    next = document.querySelector('.buttons .next'),
    prev = document.querySelector('.buttons .prev'),
    number = document.querySelector('.buttons .number');
    let hadithIndex = 0;

HadithChanger();
  function HadithChanger(){
    fetch("https://api.hadith.gading.dev/books/muslim?range=1-300")
    .then(response => response.json())
    .then(data =>{

      let Hadiths = data.data.hadiths;
      changeHadith();
      next.addEventListener('click', ()=>{
        hadithIndex == 299 ? hadithIndex = 0 : hadithIndex++;
        changeHadith()
      })
      prev.addEventListener('click', ()=>{
        hadithIndex == 0 ? hadithIndex = 299 : hadithIndex--;
        changeHadith()
      })
      function changeHadith(){
        hadithContainer.innerText = Hadiths[hadithIndex].arab;
        number.innerText = `300 - ${hadithIndex + 1}`
      }
    })
  }

//link Section//
let sections = document.querySelectorAll("section"),
    links = document.querySelectorAll('.header ul li');
links.forEach(link =>{
  link.addEventListener("click", ()=>{
    document.querySelector('.header ul li.active').classList.remove('active');
    link.classList.add('active');
    let target = link.dataset.filter;
    sections.forEach(section=>{
      if(section.classList.contains(target)){
        section.scrollIntoView({
          behavior : "smooth"
        })
      }
    })
  })
})

//asma allah alhusna//

document.getElementById('fetch-names').addEventListener('click', function() {
  fetch('https://asmaul-husna-api.vercel.app/api/all')
    .then(response => response.json())
    .then(data => {
      let names = data.data;
      let namesList = document.createElement('ul');
      namesList.classList.add('names-list'); // Add a class for styling

      names.forEach(name => {
        let listItem = document.createElement('li');
        let namesContainer = document.createElement('div');
        let latinName = document.createElement('div');
        let arabicName = document.createElement('div');
        latinName.textContent = name.arab;
        arabicName.textContent = name.latin;
        namesContainer.appendChild(latinName);
        namesContainer.appendChild(arabicName);
        listItem.appendChild(namesContainer);
        namesList.appendChild(listItem);
      });

      let newWindow = window.open('', '', 'width=600,height=800');
      newWindow.document.head.innerHTML = `
        <style>
          .names-list {
            background: rgb(38,87,121);
            background: linear-gradient(90deg, rgba(38,87,121,1) 0%, rgba(61,167,120,1) 100%);
            display: flex;
            flex-wrap: wrap;
            gap: 22px;
            padding: 10px;
            border: 1px solid black;
            border-radius: 3%;            
            direction: rtl; /* Display the names from right to left */
          }
          .names-list li {
            color: black;
            font-size: 25px;
            font-weight: bolder;
            padding: 5px;
            display: flex;
            justify-content: center; /* Align the names horizontally in the center */
            align-items: center; /* Align the names vertically in the center */
            list-style-type: none; /* Remove the bullet point */
            border-radius: 30%;
            flex-basis: calc(15% - 10px); /* Each item takes up 33% of the container width */
          }
          /* Style for each list item */

          /* Hover effect for each list item */
          .names-list li:hover {
            color: white;
            background: transparent;
            transition: background-color 0.9s;
            transition: .3s all ease-in-out;
            font-size: 28px;
          }
          .names-list div {
            text-align: center; /* Center the names horizontally */
          }

        </style>
      `;
      newWindow.document.body.appendChild(namesList);
    });
});


//surah api //

let SurahsContainer = document.querySelector('.surhasContainer');
getSurahs();

function getSurahs(){
  //fetch surahs meta data//
  fetch("https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json")
  .then(response => response.json())
  .then(data =>{
    let surahs = data;
    let idOfSurahs = surahs.length;
    SurahsContainer.innerHTML = "";
    for (let i = 0; i < idOfSurahs; i++){
      SurahsContainer.innerHTML +=
                  `
                  <div class="surah">
                    <p>سورة ${surahs[i].name}</p>
                    <p>Surat <br>${surahs[i].transliteration}</p>
                  </div>
                  `
    }

    let SurahsTitles = document.querySelectorAll('.surah');
    let popup = document.querySelector('.surah-popup'),
        VerseContainer = document.querySelector('.ayat');

    SurahsTitles.forEach((title,index)=>{
        title.addEventListener('click',()=>{
            fetch(`https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json`)
                .then(response => response.json())
                .then(data=>{
                    VerseContainer.innerHTML = "";
                    let surah = data[index];
                    surah.verses.forEach(verse=>{
                        popup.classList.add('active');
                        VerseContainer.innerHTML += `<p>(${verse.id}) - ${verse.text}</p>`;
                    })
                })
        })
    })

    let closePopup = document.querySelector('.close-popup');
    closePopup.addEventListener('click',()=>{
        popup.classList.remove('active');
    })

  })
}


//PrayTime Api //
let cards = document.querySelector('.cards');
getPrayTimes();
function getPrayTimes()
{
  fetch("https://api.aladhan.com/v1/timingsByCity/03-03-2024?city=marrakesh&country=morocco&method=8")
  .then(response => response.json())
  .then(data =>{
      let times = data.data.timings;
      cards.innerHTML = "";
      for (let time in times){
        let arabicNames = {
          Fajr: "الفجر",
          Sunrise: "الشروق",
          Dhuhr: "الظهر",
          Asr: "العصر",
          Sunset: "الغروب",
          Maghrib: "المغرب",
          Isha: "العشاء",
          Imsak: "الإمساك",
          Midnight: "منتصف الليل",
          Firstthird: "الثلث الأول",
          Lastthird: "الثلث الأخير"
      };
      let arabicTime = arabicNames[time];
        cards.innerHTML +=
        `
            <div class="card">
                <div class="circle">
                  <svg>
                    <circle cx="100" cy="100" r="100"></circle>
                  </svg>
                  <div class="praytime">${times[time]}</div>
                </div>
                <p>${arabicTime}</p>
            </div>
        `
      }
    })
}
//Active SideBar
let bars = document.querySelector('.bars'),
    SideBar = document.querySelector('.header ul');
bars.addEventListener('click',()=>{
    SideBar.classList.toggle("active");
})

async function showPopup() {
  const response = await fetch('https://api.quran.com/api/v4/chapter_recitations/1');
  const data = await response.json();
  const audioList = document.getElementById('audioList');
  audioList.innerHTML = data.audio_files.map(file => `
    <li>
      <button onclick="playChapter(${file.chapter_id})" class="surah-name"> ${getSurahName(file.chapter_id)}</button>
      <audio id="audio${file.chapter_id}" controls style="display: none;">
        <source src="${file.audio_url}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </li>
  `).join('');
  document.getElementById('popup').style.display = 'block';
}

function playChapter(chapterId) {
  const audio = document.getElementById(`audio${chapterId}`);
  const isAudioVisible = audio.style.display === 'block';

  if (isAudioVisible) {
    audio.style.display = 'none';
    audio.pause(); // Pause the audio

  } else {
    audio.style.display = 'block';
    audio.play();
  }
}

function hidePopup() {
  document.getElementById('popup').style.display = 'none';
}

function getSurahName(chapterId) {
  const surahNames = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء",
    "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان",
    "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى",
    "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور",
    "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة",
    "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن",
    "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير",
    "الإنفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
  ];
  return surahNames[chapterId - 1];
}

//Adkar//
const azkarButton = document.getElementById('azkarButton');
const azkarContent = document.getElementById('azkarContent');

let previousContent = null;

azkarButton.addEventListener('click', async () => {
    try {
        const response1 = await fetch('https://ahegazy.github.io/muslimKit/json/azkar_sabah.json');
        const data1 = await response1.json();

        const response2 = await fetch('https://ahegazy.github.io/muslimKit/json/azkar_massa.json');
        const data2 = await response2.json();

        const response3 = await fetch('https://ahegazy.github.io/muslimKit/json/PostPrayer_azkar.json');
        const data3 = await response3.json();

        if (azkarButton.textContent === 'قسم الأذكار هنا') {
            previousContent = azkarContent.innerHTML;
            azkarContent.innerHTML = `
                <h2 id="cntt">${data1.title}</h2>
                <ul id="uls">
                    ${data1.content.map(item => `<li id="lisa">-${item.zekr}   <span class="span1">//عدد مرات التكرار:</span>"<span class="span2">${item.repeat}</span>"</li><p>"${item.bless}"</p>`).join('')}
                </ul>
                <h2 id="cntt">${data2.title}</h2>
                <ul id="uls">
                    ${data2.content.map(item => `<li id="lisa">-${item.zekr}   <span class="span1">//عدد مرات التكرار:</span>"<span class="span2">${item.repeat}</span>"</li><p>"${item.bless}"</p>`).join('')}
                </ul>
                <h2 id="cntt">${data3.title}</h2>
                <ul id="uls">
                    ${data3.content.map(item => `<li id="lisa">-${item.zekr}   <span class="span1">//عدد مرات التكرار:</span>"<span class="span2">${item.repeat}</span>"</li><p>"${item.bless}"</p>`).join('')}
                </ul>
            `;
            azkarButton.textContent = 'الرجوع للرئيسية';
            azkarContent.classList.add('highlighted');
        } else {
            azkarContent.innerHTML = '';
            azkarButton.textContent = 'قسم الأذكار هنا';
            azkarContent.classList.remove('highlighted');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

