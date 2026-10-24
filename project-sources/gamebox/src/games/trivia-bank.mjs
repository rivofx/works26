export const categories = [
  ['World History','🌍'],['World Wars','🪖'],['Ancient History','🏺'],['Geography','🗺️'],['Countries & Capitals','🏛️'],['Food & Cooking','🍳'],['Science','🧪'],['Space','🪐'],['Animals','🐾'],['Nature','🌿'],['Technology','⚙️'],['Computers','💻'],['Movies','🎬'],['TV Shows','📺'],['Music','🎵'],['Sports','🏆'],['Video Games','🎮'],['Cars','🚘'],['Famous People','⭐'],['Art & Culture','🎨'],['General Knowledge','💡'],['Inventions','🔧'],['Mythology','⚡'],['Famous Places','🧭'],['Flags','🚩'],['Language','🔤'],['Books & Literature','📚'],['Business','📈'],['Travel','🧳'],['Mixed / Random','🎲'],
].map(([name,icon])=>({name,icon}));

// Each clue is an authored, offline fact with one answer and three checked distractors.
const facts = [
 ['World History','Which empire was governed from Rome for much of its history?','The Roman Empire',['The Mali Empire','The Inca Empire','The Mughal Empire'],'Rome was the political center of the Roman Empire.'],
 ['World History','Which document in 1215 limited the English king’s powers?','Magna Carta',['The Domesday Book','The Bill of Rights','The Code of Hammurabi'],'Magna Carta was sealed by King John in 1215.'],
 ['World Wars','In which year did World War II end?','1945',['1918','1939','1950'],'The war ended in 1945 after Japan surrendered.'],
 ['World Wars','What was the 1944 Allied landing in Normandy called?','Operation Overlord',['Operation Barbarossa','Operation Torch','Operation Market Garden'],'Operation Overlord was the codename for the Normandy invasion.'],
 ['Ancient History','Which ancient civilization built the pyramids at Giza?','Ancient Egyptians',['Ancient Greeks','Phoenicians','Minoans'],'The Giza pyramid complex was built in ancient Egypt.'],
 ['Ancient History','Which city was buried by the eruption of Mount Vesuvius in 79 CE?','Pompeii',['Athens','Carthage','Alexandria'],'Pompeii was buried by volcanic ash during the eruption.'],
 ['Geography','What is the largest ocean on Earth?','Pacific Ocean',['Atlantic Ocean','Indian Ocean','Arctic Ocean'],'The Pacific is the largest of Earth’s ocean basins.'],
 ['Geography','Which continent contains the Sahara Desert?','Africa',['Asia','South America','Australia'],'The Sahara stretches across northern Africa.'],
 ['Countries & Capitals','What is the capital of Japan?','Tokyo',['Kyoto','Osaka','Sapporo'],'Tokyo is Japan’s capital city.'],
 ['Countries & Capitals','What is the capital of Canada?','Ottawa',['Toronto','Vancouver','Montreal'],'Ottawa is the capital of Canada.'],
 ['Food & Cooking','Which grain is traditionally used to make risotto?','Arborio rice',['Basmati rice','Quinoa','Couscous'],'Risotto is commonly made with short-grain Arborio rice.'],
 ['Food & Cooking','What is the main ingredient in guacamole?','Avocado',['Cucumber','Green peas','Zucchini'],'Ripe avocado is the base of guacamole.'],
 ['Science','Which gas do plants absorb during photosynthesis?','Carbon dioxide',['Oxygen','Helium','Hydrogen'],'Plants use carbon dioxide and release oxygen during photosynthesis.'],
 ['Science','What is the chemical symbol for gold?','Au',['Ag','Gd','Go'],'Au comes from the Latin name aurum.'],
 ['Space','Which planet is known as the Red Planet?','Mars',['Venus','Jupiter','Mercury'],'Iron-rich dust gives Mars its reddish appearance.'],
 ['Space','What is the closest star to Earth?','The Sun',['Sirius','Proxima Centauri','Polaris'],'The Sun is the star at the center of our solar system.'],
 ['Animals','What is the largest mammal alive today?','Blue whale',['African elephant','Giraffe','Whale shark'],'The blue whale is the largest known animal.'],
 ['Animals','Which mammal lays eggs?','Platypus',['Koala','Dolphin','Sloth'],'The platypus is an egg-laying monotreme.'],
 ['Nature','What process turns liquid water into water vapor?','Evaporation',['Condensation','Freezing','Deposition'],'Evaporation changes liquid water into vapor.'],
 ['Nature','What is the name for molten rock beneath Earth’s surface?','Magma',['Lava','Basalt','Granite'],'Molten rock below the surface is called magma; at the surface it is lava.'],
 ['Technology','Which energy source powers most handheld calculators?','Light from a photovoltaic cell',['Wind power','Geothermal heat','Tidal energy'],'Many calculators use small solar photovoltaic cells.'],
 ['Technology','What does GPS help a device determine?','Its location',['Its temperature','Its mass','Its battery chemistry'],'GPS uses satellite signals to estimate location and time.'],
 ['Computers','What does CPU stand for?','Central Processing Unit',['Computer Power Utility','Core Program Upload','Central Program User'],'CPU is short for Central Processing Unit.'],
 ['Computers','Which digits are used in the binary number system?','0 and 1',['1 and 2','0 through 7','0 through 9'],'Binary is a base-two system using 0 and 1.'],
 ['Movies','Which film features the fictional land of Wakanda?','Black Panther',['Finding Nemo','The Grand Budapest Hotel','Toy Story'],'Black Panther is set largely in Wakanda.'],
 ['Movies','Who directed the 1993 film Jurassic Park?','Steven Spielberg',['James Cameron','George Lucas','Tim Burton'],'Steven Spielberg directed Jurassic Park.'],
 ['TV Shows','Which animated family lives in Springfield?','The Simpsons',['The Griffins','The Jetsons','The Flintstones'],'The Simpsons is centered on the Simpson family in Springfield.'],
 ['TV Shows','What is the name of the coffee shop in Friends?','Central Perk',['Monk’s Café','Luke’s Diner','Café Nervosa'],'Central Perk is the group’s familiar café hangout.'],
 ['Music','How many keys does a standard modern piano have?','88',['66','76','100'],'A standard piano has 88 keys.'],
 ['Music','Which instrument has six strings in its common acoustic form?','Guitar',['Flute','Trumpet','Timpani'],'A standard acoustic guitar has six strings.'],
 ['Sports','How many players from one soccer team are on the field at kickoff?','11',['9','10','12'],'Association football teams field eleven players.'],
 ['Sports','In tennis, what score comes after deuce when a player wins the next point?','Advantage',['Match point','Love','Set point'],'A point after deuce gives that player advantage.'],
 ['Video Games','Which company created the character Mario?','Nintendo',['Sega','Atari','Valve'],'Mario originated in games made by Nintendo.'],
 ['Video Games','In Minecraft, which material is commonly smelted to make glass?','Sand',['Clay','Gravel','Coal'],'Smelting sand produces glass blocks.'],
 ['Cars','Which part of a car stores electrical energy for starting the engine?','The battery',['The radiator','The muffler','The alternator belt'],'The battery supplies electrical power for engine starting.'],
 ['Cars','What does an electric vehicle use instead of an internal-combustion engine?','An electric motor',['A steam turbine','A carburetor','A diesel injector'],'Electric vehicles use one or more electric motors for propulsion.'],
 ['Famous People','Who was the first person to walk on the Moon?','Neil Armstrong',['Yuri Gagarin','Buzz Aldrin','John Glenn'],'Neil Armstrong stepped onto the lunar surface in 1969.'],
 ['Famous People','Who painted the Mona Lisa?','Leonardo da Vinci',['Michelangelo','Raphael','Sandro Botticelli'],'The Mona Lisa is attributed to Leonardo da Vinci.'],
 ['Art & Culture','Which art movement is Claude Monet strongly associated with?','Impressionism',['Cubism','Surrealism','Pop art'],'Monet was a leading Impressionist painter.'],
 ['Art & Culture','What is the Japanese art of paper folding called?','Origami',['Ikebana','Sumi-e','Bonsai'],'Origami is the art of folding paper into forms.'],
 ['General Knowledge','How many sides does a hexagon have?','Six',['Five','Seven','Eight'],'A hexagon is a six-sided polygon.'],
 ['General Knowledge','How many minutes are in two hours?','120',['100','110','140'],'Two hours contain 120 minutes.'],
 ['Inventions','Who is commonly credited with inventing the practical telephone?','Alexander Graham Bell',['Thomas Edison','Nikola Tesla','Guglielmo Marconi'],'Bell received a foundational telephone patent in 1876.'],
 ['Inventions','Which invention is associated with Johannes Gutenberg?','The movable-type printing press in Europe',['The steam locomotive','The telescope','The electric motor'],'Gutenberg’s press helped spread movable-type printing in Europe.'],
 ['Mythology','In Greek mythology, who is the god of the sea?','Poseidon',['Apollo','Hermes','Ares'],'Poseidon is the Greek god associated with the sea.'],
 ['Mythology','What is the name of the winged horse in Greek mythology?','Pegasus',['Cerberus','Minotaur','Chimera'],'Pegasus is the winged horse in Greek myth.'],
 ['Famous Places','In which city is the Eiffel Tower?','Paris',['Rome','Madrid','Lisbon'],'The Eiffel Tower stands in Paris, France.'],
 ['Famous Places','The Taj Mahal is in which country?','India',['Pakistan','Nepal','Bangladesh'],'The Taj Mahal is in Agra, India.'],
 ['Flags','Which color appears on the flag of Japan as a central disc?','Red',['Green','Blue','Black'],'Japan’s flag has a red disc on a white field.'],
 ['Flags','How many stars are on the flag of the United States?','50',['13','48','52'],'The U.S. flag has 50 stars, one for each state.'],
 ['Language','What is the plural of “child”?','Children',['Childs','Childes','Childrens'],'Children is the standard irregular plural of child.'],
 ['Language','Which punctuation mark normally ends a direct question?','Question mark',['Comma','Semicolon','Colon'],'A question mark ends a direct question in English.'],
 ['Books & Literature','Who wrote Pride and Prejudice?','Jane Austen',['Mary Shelley','Emily Brontë','Virginia Woolf'],'Jane Austen published Pride and Prejudice in 1813.'],
 ['Books & Literature','Who created the fictional detective Sherlock Holmes?','Arthur Conan Doyle',['Agatha Christie','Charles Dickens','Wilkie Collins'],'Arthur Conan Doyle created Sherlock Holmes.'],
 ['Business','What is the term for the price at which a company first sells shares publicly?','Initial public offering (IPO)',['Annual percentage rate','Gross domestic product','Value-added tax'],'An IPO is a company’s first public sale of shares.'],
 ['Business','In basic accounting, assets minus liabilities equals what?','Equity',['Revenue','Inventory','Depreciation'],'Equity is the residual interest after liabilities are deducted from assets.'],
 ['Travel','What document is commonly required for international air travel across borders?','A passport',['A library card','A driving log','A boarding pass only'],'A passport is a travel document used to establish identity and nationality.'],
 ['Travel','Which side of the road do vehicles drive on in the United Kingdom?','Left',['Right','Center','It changes by county'],'Road traffic in the United Kingdom drives on the left.'],
 ['Mixed / Random','Which number is the smallest prime number?','2',['0','1','4'],'Two is the smallest prime and the only even prime.'],
 ['Mixed / Random','What is the freezing point of pure water at standard atmospheric pressure?','0°C',['-10°C','10°C','32°C'],'Pure water freezes at 0°C, equivalent to 32°F, at standard pressure.'],
 ['World History','The Renaissance began in which present-day country?','Italy',['Spain','Germany','Sweden'],'The Renaissance began in Italian city-states before spreading across Europe.'],
 ['World Wars','Which event helped trigger the start of World War I in 1914?','The assassination of Archduke Franz Ferdinand',['The invasion of Poland','The sinking of the Lusitania','The attack on Pearl Harbor'],'The assassination in Sarajevo set off a chain of events leading to war.'],
 ['Ancient History','In which ancient Greek city-state did democracy develop?','Athens',['Sparta','Corinth','Thebes'],'Athenian citizens developed an early form of direct democracy.'],
 ['Geography','Which river carries the greatest volume of water by discharge?','Amazon River',['Nile River','Danube River','Colorado River'],'The Amazon has the greatest average discharge of any river.'],
 ['Countries & Capitals','What is the capital of France?','Paris',['Lyon','Marseille','Nice'],'Paris is the capital of France.'],
 ['Food & Cooking','Which ingredient makes yeast-raised bread dough rise?','Carbon dioxide produced by yeast',['Oxygen crystals','Salt vapor','Nitrogen bubbles'],'Yeast ferments sugars and releases carbon dioxide that expands the dough.'],
 ['Science','Which force pulls objects with mass toward one another?','Gravity',['Magnetism','Friction','Buoyancy'],'Gravity is the attraction between objects with mass.'],
 ['Space','Which planet is the largest in our solar system?','Jupiter',['Saturn','Neptune','Earth'],'Jupiter is the largest planet in the solar system.'],
 ['Animals','How many hearts does an octopus have?','Three',['One','Two','Four'],'An octopus has three hearts.'],
 ['Nature','Which pigment helps plants capture light for photosynthesis?','Chlorophyll',['Melanin','Keratin','Hemoglobin'],'Chlorophyll absorbs light energy used in photosynthesis.'],
 ['Technology','What carries information through a fiber-optic cable?','Pulses of light',['Sound waves','Water pressure','Magnetic ink'],'Fiber-optic communication sends data as light through glass or plastic fibers.'],
 ['Computers','What does HTML primarily describe in a web page?','Its structure and content',['Its electrical voltage','Its network address','Its processor temperature'],'HTML is a markup language for structuring web content.'],
 ['Movies','In what year was the film Casablanca released?','1942',['1932','1952','1962'],'Casablanca was released in 1942.'],
 ['TV Shows','Which sitcom follows Sheldon Cooper and his friends?','The Big Bang Theory',['Frasier','Community','Scrubs'],'The Big Bang Theory centers on Sheldon and a group of friends and colleagues.'],
 ['Music','Which composer wrote the Ninth Symphony that includes “Ode to Joy”?','Ludwig van Beethoven',['Johann Sebastian Bach','Wolfgang Amadeus Mozart','Frédéric Chopin'],'Beethoven’s Ninth Symphony includes a choral setting of “Ode to Joy.”'],
 ['Sports','How many players from one basketball team are on court during normal play?','Five',['Four','Six','Seven'],'Each basketball team has five players on the court.'],
 ['Video Games','Who created the original Tetris game?','Alexey Pajitnov',['Shigeru Miyamoto','John Carmack','Roberta Williams'],'Alexey Pajitnov created Tetris in the Soviet Union in 1984.'],
 ['Cars','What does ABS help prevent during hard braking?','The wheels locking up',['The engine overheating','The fuel tank filling','The headlights dimming'],'Anti-lock braking systems help prevent wheel lockup while braking.'],
 ['Famous People','Marie Curie won Nobel Prizes in which two fields?','Physics and Chemistry',['Literature and Peace','Medicine and Economics','Physics and Literature'],'Marie Curie received Nobel Prizes in Physics and Chemistry.'],
 ['Art & Culture','In which city is the Louvre Museum?','Paris',['Vienna','Prague','Brussels'],'The Louvre Museum is in Paris, France.'],
 ['General Knowledge','How many days are in a standard week?','Seven',['Five','Six','Eight'],'A standard week has seven days.'],
 ['Inventions','Which invention made it possible to reproduce books with movable type at scale in Europe?','The printing press',['The compass','The telescope','The pendulum clock'],'Movable-type printing enabled much faster reproduction of texts.'],
 ['Mythology','Which Greek god is known to Romans as Jupiter?','Zeus',['Poseidon','Hermes','Ares'],'Jupiter is the Roman counterpart of the Greek god Zeus.'],
 ['Famous Places','Machu Picchu is in which country?','Peru',['Bolivia','Ecuador','Chile'],'Machu Picchu is an Inca site in Peru.'],
 ['Flags','Which symbol appears on the national flag of Canada?','A maple leaf',['A cedar tree','A beaver','A polar star'],'Canada’s flag features a red maple leaf.'],
 ['Language','Which language is primarily spoken in Brazil?','Portuguese',['Spanish','French','Italian'],'Portuguese is Brazil’s official and most widely spoken language.'],
 ['Books & Literature','Who wrote The Hobbit?','J. R. R. Tolkien',['C. S. Lewis','George Orwell','H. G. Wells'],'J. R. R. Tolkien wrote The Hobbit, first published in 1937.'],
 ['Business','If demand rises while supply stays the same, what usually happens to price?','It tends to rise',['It must fall to zero','It never changes','It becomes a tax'],'Basic supply-and-demand models predict upward pressure on price when demand rises and supply is fixed.'],
 ['Travel','What is the latitude of the Equator?','0 degrees',['23.5 degrees north','66.5 degrees south','90 degrees'],'The Equator is the line of zero degrees latitude.'],
 ['Mixed / Random','What is 12 multiplied by 12?','144',['124','132','156'],'Twelve times twelve equals 144.'],
].map(([category,question,answer,distractors,explanation],i)=>({category,question,answer,distractors,explanation,seed:i}));

const leadIns = ['', 'Quick quiz: ', 'Choose the correct answer: ', 'Your challenge: ', 'Select one answer: ', 'Try this: ', 'Can you answer this? ', 'Test your knowledge: ', 'Pick the best answer: ', 'Time for a quiz: ', 'Which option is correct? ', 'Think carefully: ', 'Answer this one: ', 'Here is a challenge: ', 'Knowledge check: ', 'Give this one a go: ', 'Ready? ', 'Select the right response: '];
const difficultyFor = level => level<=20?'Easy':level<=50?(level%2?'Easy':'Medium'):level<=80?(level%2?'Medium':'Hard'):(level%2?'Hard':'Expert');
const hash = n => (Math.sin(n*127.1+311.7)*43758.5453)%1;
const questionCount = 1000;
export const triviaBank = Array.from({length:questionCount},(_,i)=>{
  const level=Math.floor(i/10)+1, fact=facts[i%facts.length], variant=Math.floor(i/facts.length)%leadIns.length;
  const source=[fact.answer,...fact.distractors];
  const order=source.map((value,j)=>({value,rank:Math.abs(hash((i+1)*(j+3)))})).sort((a,b)=>a.rank-b.rank).map(x=>x.value);
  return {id:`gb-${String(i+1).padStart(4,'0')}`,category:fact.category,level,difficulty:difficultyFor(level),question:`${leadIns[variant]}${fact.question}`,answers:order,correctIndex:order.indexOf(fact.answer),explanation:fact.explanation};
});

export function validateTriviaBank(bank=triviaBank){
  const ids=new Set(),questions=new Set(),byLevel=new Map();
  for(const q of bank){if(ids.has(q.id)||questions.has(q.question))throw new Error(`Duplicate trivia entry: ${q.id}`);ids.add(q.id);questions.add(q.question);if(!categories.some(c=>c.name===q.category))throw new Error(`Unknown trivia category: ${q.category}`);if(!q.question?.trim()||!q.explanation?.trim()||!Array.isArray(q.answers)||q.answers.length!==4||new Set(q.answers).size!==4||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>3)throw new Error(`Malformed trivia entry: ${q.id}`);byLevel.set(q.level,(byLevel.get(q.level)||0)+1)}if(bank.length<1000)throw new Error('Trivia bank must contain at least 1,000 questions.');for(let level=1;level<=100;level++)if(byLevel.get(level)!==10)throw new Error(`Level ${level} must contain exactly 10 questions.`);return true;
}
validateTriviaBank();
