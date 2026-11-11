const r = String.raw;

export default {
  id: 'ai0',
  track: 'ai',
  title: 'Matematica: ripasso lampo',
  subtitle: 'Gli attrezzi che useremo in tutto il percorso, con il punto di vista di chi poi costruisce modelli.',
  lessons: [
    /* ───────────── 1 ───────────── */
    {
      title: 'Vettori e prodotto scalare',
      minutes: 12,
      blocks: [
        { t: 'p', x: r`Un <b>vettore</b> \(\mathbf{x}\in\mathbb{R}^n\) è una lista ordinata di \(n\) numeri. Per un fisico è una freccia; per un modello di AI è <i>qualunque cosa sia stata trasformata in numeri</i>: i pixel di un'immagine, il significato di una parola (embedding), i pesi di un neurone, lo stato di un'intera frase.` },
        { t: 'def', term: 'Norma (lunghezza)', x: r`\(\lVert\mathbf{x}\rVert=\sqrt{\sum_i x_i^2}\). Per \((3,4)\) vale \(5\).` },
        { t: 'def', term: 'Prodotto scalare', x: r`\(\mathbf{a}\cdot\mathbf{b}=\sum_i a_i b_i=\lVert\mathbf{a}\rVert\,\lVert\mathbf{b}\rVert\cos\theta\). Misura <i>quanto due vettori puntano nella stessa direzione</i>: positivo se concordi, zero se ortogonali, negativo se opposti.` },
        { t: 'widget', name: 'dot', cap: 'Muovi gli angoli: il prodotto scalare cambia segno quando i vettori superano i 90°.' },
        { t: 'def', term: 'Similarità coseno', x: r`\(\cos\theta=\dfrac{\mathbf{a}\cdot\mathbf{b}}{\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert}\in[-1,1]\). Ignora la lunghezza e guarda solo la direzione: è il modo standard di confrontare embedding.` },
        { t: 'why', x: r`Il cuore di un transformer, l'<b>attention</b>, calcola prodotti scalari tra vettori «query» e «key» per decidere a cosa prestare attenzione. Il fattore \(1/\sqrt{d_k}\) esiste perché, per componenti indipendenti a varianza 1, il prodotto scalare ha varianza \(d_k\): senza normalizzazione i valori crescono con la dimensione e la softmax (lezione 4) satura. Anche la ricerca semantica dei sistemi RAG è solo similarità coseno tra embedding.` },
      ],
      quiz: [
        { type: 'num', q: r`Calcola \(\mathbf{a}\cdot\mathbf{b}\) con \(\mathbf{a}=(1,2,3)\), \(\mathbf{b}=(4,-5,6)\).`, answer: 12, explain: r`\(1\cdot4+2\cdot(-5)+3\cdot6=4-10+18=12\).` },
        { type: 'num', q: r`Qual è la norma di \((3,4)\)?`, answer: 5, explain: r`\(\sqrt{9+16}=5\).` },
        { type: 'mcq', q: r`Due vettori hanno prodotto scalare \(0\). Cosa significa?`, options: ['Sono ortogonali (nessuna componente in comune)', 'Sono identici', 'Sono opposti', 'Hanno la stessa lunghezza'], answer: 0, explain: r`\(\cos\theta=0\Rightarrow\theta=90^\circ\) (se nessuno dei due è nullo).` },
        { type: 'mcq', q: r`Se raddoppio la lunghezza di \(\mathbf{b}\) lasciando invariata la direzione, la similarità coseno con \(\mathbf{a}\)…`, options: ['raddoppia', 'resta invariata', 'si dimezza', 'diventa zero'], answer: 1, explain: 'Il coseno normalizza per le lunghezze: dipende solo dall\'angolo.' },
        { type: 'num', q: r`Similarità coseno tra \((1,0)\) e \((1,1)\)? (3 decimali)`, answer: 0.707, tol: 0.005, explain: r`\(\dfrac{1}{1\cdot\sqrt2}\approx0.707\) (angolo di \(45^\circ\)).` },
      ],
    },
    /* ───────────── 2 ───────────── */
    {
      title: 'Matrici e strati di una rete',
      minutes: 12,
      blocks: [
        { t: 'p', x: r`Una <b>matrice</b> \(A\in\mathbb{R}^{m\times n}\) è una funzione lineare da \(\mathbb{R}^n\) a \(\mathbb{R}^m\). Il prodotto \(A\mathbf{x}\) ha come \(i\)-esima componente il prodotto scalare tra la riga \(i\) di \(A\) e \(\mathbf{x}\).` },
        { t: 'math', x: r`(A\mathbf{x})_i=\sum_{j=1}^{n}A_{ij}x_j \qquad\qquad (m\times n)\cdot(n\times p)=(m\times p)` },
        { t: 'ul', items: [r`Il prodotto matriciale <b>non è commutativo</b>: in generale \(AB\ne BA\).`, r`È associativo: \(A(BC)=(AB)C\). Per questo si possono «fondere» trasformazioni lineari consecutive.`, r`Le dimensioni interne devono coincidere: il controllo delle <i>shape</i> è il debug più frequente nel deep learning.`] },
        { t: 'def', term: 'Strato lineare (fully connected)', x: r`\(\mathbf{y}=W\mathbf{x}+\mathbf{b}\), con \(W\in\mathbb{R}^{m\times n}\). Parametri: \(mn+m\).` },
        { t: 'p', x: r`Perché serve una <b>non-linearità</b> tra gli strati? Perché \(W_2(W_1\mathbf{x})=(W_2W_1)\mathbf{x}\): due strati lineari senza nulla in mezzo equivalgono a uno solo. Inserendo una funzione come ReLU, \(\max(0,z)\), la rete può rappresentare funzioni davvero complesse.` },
        { t: 'why', x: r`Quasi tutto il costo di un LLM sono moltiplicazioni matriciali, ed è per questo che servono le GPU. Anche il <b>LoRA</b> (fine-tuning economico) è pura algebra lineare: invece di aggiornare una matrice \(m\times n\) con \(mn\) parametri, impara un aggiornamento di rango basso \(BA\) con \(B\in\mathbb{R}^{m\times r}\), \(A\in\mathbb{R}^{r\times n}\), cioè solo \(r(m+n)\) parametri.` },
      ],
      quiz: [
        { type: 'mcq', q: r`Qual è la shape di \(AB\) se \(A\) è \(4\times3\) e \(B\) è \(3\times5\)?`, options: [r`\(4\times5\)`, r`\(3\times3\)`, r`\(5\times4\)`, 'Non è definito'], answer: 0, explain: r`\((m\times n)(n\times p)=(m\times p)\): \(4\times5\).` },
        { type: 'num', q: r`Quanti parametri ha uno strato lineare \(784\to128\) con bias?`, answer: 100480, explain: r`\(784\cdot128+128=100352+128=100480\).` },
        { type: 'num', q: r`Calcola \(\begin{pmatrix}1&2\\3&4\end{pmatrix}\begin{pmatrix}1\\1\end{pmatrix}\). Quanto vale la seconda componente?`, answer: 7, explain: r`Riga 2 · vettore: \(3\cdot1+4\cdot1=7\).` },
        { type: 'mcq', q: r`Perché tra due strati lineari si inserisce una funzione di attivazione non lineare?`, options: ['Per rendere il calcolo più veloce', 'Perché senza di essa due strati equivalgono a uno solo', 'Per ridurre il numero di parametri', 'Per evitare l\'overfitting'], answer: 1, explain: r`\(W_2(W_1x)=(W_2W_1)x\): la composizione di lineari è lineare.` },
        { type: 'mcq', q: r`In generale, \(AB=BA\)?`, options: ['Sempre', 'No, in generale no', 'Solo se le matrici sono quadrate', 'Solo se hanno la stessa shape'], answer: 1, explain: 'Anche tra matrici quadrate è falso in generale: il prodotto non è commutativo.' },
      ],
    },
    /* ───────────── 3 ───────────── */
    {
      title: 'Derivate, gradiente, regola della catena',
      minutes: 14,
      blocks: [
        { t: 'p', x: r`La <b>derivata</b> \(f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}\) è la pendenza locale. Equivale ad approssimare la funzione con una retta: \(f(x+h)\approx f(x)+f'(x)\,h\).` },
        { t: 'def', term: 'Gradiente', x: r`Per \(f:\mathbb{R}^n\to\mathbb{R}\), \(\nabla f=\left(\frac{\partial f}{\partial x_1},\dots,\frac{\partial f}{\partial x_n}\right)\). Punta nella direzione di <i>massima crescita</i> di \(f\); \(-\nabla f\) in quella di massima discesa.` },
        { t: 'def', term: 'Gradient descent', x: r`\(\theta\leftarrow\theta-\eta\,\nabla_\theta L(\theta)\), dove \(L\) è la <i>loss</i> e \(\eta\) il <i>learning rate</i>. È l'algoritmo che «allena» quasi ogni modello.` },
        { t: 'widget', name: 'gd', cap: 'Prova η piccolo, ottimale (0.5), e poi > 1: il passo diventa troppo grande e diverge.' },
        { t: 'def', term: 'Regola della catena', x: r`\((f\circ g)'(x)=f'(g(x))\,g'(x)\). Per funzioni a più variabili, i contributi lungo tutti i cammini si sommano.` },
        { t: 'p', x: r`<b>Esempio.</b> Regressione con un solo peso: \(L(w)=(wx-y)^2\). Posto \(u=wx-y\), \(\dfrac{dL}{dw}=\dfrac{dL}{du}\dfrac{du}{dw}=2u\cdot x=2(wx-y)\,x\).` },
        { t: 'why', x: r`La <b>backpropagation</b> non è altro che la regola della catena applicata in modo ordinato su un grafo computazionale, dall'uscita verso l'ingresso, riusando i calcoli intermedi. Se capisci questa lezione, il resto del deep learning è «solo» tanta contabilità. Il learning rate è uno dei primi iperparametri da tarare: troppo alto e l'allenamento esplode, troppo basso e non finisce mai.` },
      ],
      quiz: [
        { type: 'num', q: r`Calcola \(\dfrac{d}{dx}x^3\) in \(x=2\).`, answer: 12, explain: r`\(3x^2=3\cdot4=12\).` },
        { type: 'num', q: r`Per \(f(x,y)=x^2+3y\), quanto vale \(\partial f/\partial y\) in \((1,2)\)?`, answer: 3, explain: r`\(\partial f/\partial y=3\) (costante).` },
        { type: 'num', q: r`Un passo di gradient descent: \(\theta=5\), \(\nabla L=2\), \(\eta=0.1\). Nuovo \(\theta\)?`, answer: 4.8, explain: r`\(5-0.1\cdot2=4.8\).` },
        { type: 'num', q: r`Calcola \(\dfrac{d}{dx}(3x+1)^2\) in \(x=1\).`, answer: 24, explain: r`Catena: \(2(3x+1)\cdot3=2\cdot4\cdot3=24\).` },
        { type: 'mcq', q: r`Con \(f(x)=x^2\) e update \(x\leftarrow x-\eta\,2x\), cosa succede per \(\eta>1\)?`, options: ['Converge più in fretta', 'Il passo oltrepassa il minimo e |x| cresce: diverge', 'Si ferma a x=0 subito', 'Non cambia nulla'], answer: 1, explain: r`\(x\leftarrow(1-2\eta)x\): se \(\eta>1\) allora \(|1-2\eta|>1\) e \(|x|\) cresce a ogni passo.` },
      ],
    },
    /* ───────────── 4 ───────────── */
    {
      title: 'Probabilità, softmax, cross-entropy',
      minutes: 16,
      blocks: [
        { t: 'p', x: r`Una distribuzione discreta assegna \(p(x)\ge0\) con \(\sum_x p(x)=1\). Servono quattro idee: probabilità <b>condizionata</b> \(P(A|B)=\frac{P(A\cap B)}{P(B)}\), <b>Bayes</b> \(P(A|B)=\frac{P(B|A)P(A)}{P(B)}\), <b>valore atteso</b> \(\mathbb{E}[X]=\sum_x x\,p(x)\) e <b>varianza</b> \(\mathrm{Var}(X)=\mathbb{E}[X^2]-\mathbb{E}[X]^2\).` },
        { t: 'quote', x: 'Un modello linguistico è, a conti fatti, una distribuzione di probabilità sul prossimo token.', by: 'idea alla base dei language model autoregressivi' },
        { t: 'math', x: r`P(x_1,\dots,x_n)=\prod_{t=1}^{n}P(x_t\mid x_1,\dots,x_{t-1})` },
        { t: 'p', x: r`La rete produce numeri reali qualsiasi (<i>logit</i>) \(z_i\). La <b>softmax</b> li trasforma in probabilità:` },
        { t: 'math', x: r`\mathrm{softmax}(\mathbf{z}/T)_i=\frac{e^{z_i/T}}{\sum_j e^{z_j/T}}` },
        { t: 'widget', name: 'softmax', cap: 'T basso → distribuzione quasi deterministica (greedy); T alto → quasi uniforme. È la «temperatura» che trovi nelle API.' },
        { t: 'def', term: 'Cross-entropy e perplexity', x: r`\(H(p,q)=-\sum_x p(x)\log q(x)\). Se il token corretto è uno solo, la loss è \(-\log q(\text{corretto})\): vale \(0\) se il modello è certo e giusto, cresce se assegna poca probabilità. La perplexity è \(e^{\text{loss}}\): «tra quante scelte equiprobabili esita il modello».` },
        { t: 'why', x: r`Allenare un LLM significa minimizzare la cross-entropy sul token successivo, su trilioni di token. Temperatura, top-k e top-p che regoli nelle API agiscono solo su questa distribuzione al momento della generazione. Capire che l'output è <i>campionato</i> da una distribuzione spiega perché lo stesso prompt può dare risposte diverse, e perché un modello può essere «sicuro e sbagliato».` },
      ],
      quiz: [
        { type: 'num', q: r`\(P(A)=0.3\) e \(P(B|A)=0.5\). Quanto vale \(P(A\cap B)\)?`, answer: 0.15, explain: r`\(P(A\cap B)=P(B|A)P(A)=0.15\).` },
        { type: 'num', q: r`Softmax di \((0,0,0)\): probabilità del primo elemento (3 decimali)?`, answer: 0.333, tol: 0.005, explain: r`Logit uguali ⇒ distribuzione uniforme: \(1/3\).` },
        { type: 'mcq', q: r`Cosa succede alla softmax quando \(T\to0\)?`, options: ['Diventa uniforme', 'Concentra tutta la probabilità sul logit massimo (≈ argmax)', 'Le probabilità non sommano più a 1', 'Restituisce sempre 0.5'], answer: 1, explain: r`Dividendo per \(T\) piccolo le differenze si amplificano enormemente: vince il massimo.` },
        { type: 'num', q: r`Il modello assegna probabilità \(0.25\) al token corretto. Quanto vale la loss \(-\ln q\)? (3 decimali)`, answer: 1.386, tol: 0.005, explain: r`\(-\ln0.25=\ln4\approx1.386\).` },
        { type: 'num', q: r`Malattia con prevalenza 1%, test con sensibilità 99% e falsi positivi 5%. Dato un test positivo, qual è \(P(\text{malato}|+)\)? (3 decimali)`, answer: 0.167, tol: 0.005, explain: r`\(\frac{0.99\cdot0.01}{0.99\cdot0.01+0.05\cdot0.99}=\frac{0.0099}{0.0594}\approx0.167\). Il vecchio classico del falso positivo: la prevalenza bassa pesa tantissimo.` },
      ],
    },
  ],

  /* ───────────── verifica finale ───────────── */
  exam: [
    { type: 'mcq', q: r`I vettori \((2,1)\) e \((-1,2)\) sono…`, options: ['Paralleli', 'Ortogonali', 'Opposti', 'Uguali'], answer: 1, explain: r`Prodotto scalare: \(-2+2=0\).` },
    { type: 'num', q: r`Norma di \((1,2,2)\)?`, answer: 3, explain: r`\(\sqrt{1+4+4}=3\).` },
    { type: 'num', q: r`Quante moltiplicazioni scalari servono per \(AB\) con \(A\in\mathbb{R}^{3\times4}\), \(B\in\mathbb{R}^{4\times2}\)?`, answer: 24, explain: r`Ognuno dei \(3\cdot2\) elementi richiede \(4\) prodotti: \(24\).` },
    { type: 'mcq', q: r`Perché nell'attention si divide per \(\sqrt{d_k}\)?`, options: ['Per rendere la matrice simmetrica', 'Perché il prodotto scalare di vettori casuali ha varianza ∝ d_k e la softmax saturerebbe', 'Per ridurre la memoria', 'Per ottenere probabilità negative'], answer: 1, explain: 'La varianza cresce linearmente con la dimensione; dividere per √d_k riporta la scala a ~1.' },
    { type: 'num', q: r`Calcola \(\dfrac{d}{dx}e^{2x}\) in \(x=0\).`, answer: 2, explain: r`\(2e^{2x}\) in \(0\) vale \(2\).` },
    { type: 'mcq', q: 'Per minimizzare una loss, in che direzione ci si muove rispetto al gradiente?', options: ['Nella stessa direzione', 'Nella direzione opposta', 'Ortogonalmente', 'Non importa'], answer: 1, explain: 'Il gradiente indica la massima crescita; si va nel verso opposto.' },
    { type: 'num', q: r`\(\theta=1\), \(\nabla L=-4\), \(\eta=0.25\). Nuovo \(\theta\)?`, answer: 2, explain: r`\(1-0.25\cdot(-4)=2\).` },
    { type: 'mcq', q: 'Quale proprietà ha sempre l\'output di una softmax?', options: ['Componenti positive che sommano a 1', 'Componenti che sommano a 0', 'Una sola componente positiva', 'Componenti tra -1 e 1'], answer: 0, explain: 'Esponenziali positivi divisi per la loro somma.' },
    { type: 'num', q: r`Logit \((0,\ln3)\). Probabilità del secondo (3 decimali)?`, answer: 0.75, tol: 0.005, explain: r`\(\frac{3}{1+3}=0.75\).` },
    { type: 'mcq', q: 'Qual è l\'obiettivo di allenamento standard di un LLM?', options: ['Massimizzare la lunghezza delle risposte', 'Minimizzare la cross-entropy sul token successivo', 'Minimizzare il numero di parametri', 'Massimizzare la temperatura'], answer: 1, explain: 'Pretraining autoregressivo: predire il token successivo.' },
  ],
};
