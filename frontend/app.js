const API = 'http://localhost:3000'

function el(id) { return document.getElementById(id) }

// DOM nodes
const registerForm = el('register-form')
const loginForm = el('login-form')
const resetRequestForm = el('reset-request-form')
const resetConfirmForm = el('reset-confirm-form')
const showRegisterBtn = el('show-register')
const showLoginBtn = el('show-login')
const logoutBtn = el('logout')
const authForms = el('auth-forms')
const domainSelection = el('domain-selection')
const questionnaire = el('questionnaire')
const qaForm = el('qa-form')
const questionsDiv = el('questions')
const qTitle = el('q-title')
const success = el('success')
const summary = el('summary')
const navbar = el('navbar')

let token = localStorage.getItem('token')
let currentDomain = null

const questionBanks = {
    'DevOps': [
        'Which cloud providers have you used?',
        'Which CI/CD tools have you used?',
        'Have you worked with Kubernetes? If yes, describe briefly.',
        'Which IaC tools have you used (Terraform/CloudFormation/Ansible)?',
        'How do you approach logging and monitoring?',
        'Have you worked on disaster recovery/backup strategies?',
        'How do you secure container images and registries?',
        'Explain a time you optimized deployment pipelines.',
        'How comfortable are you with Linux administration?',
        'Describe a major production incident you handled.'
    ],
    'Full-stack': [
        'Which frontend frameworks do you prefer?',
        'Which backend stacks have you used?',
        'Do you have experience with relational databases (SQL)?',
        'Have you worked with NoSQL databases?',
        'Do you use TypeScript? How comfortable are you?',
        'Explain how you structure RESTful APIs.',
        'Have you deployed apps to cloud providers? Which ones?',
        'How do you ensure web app security (XSS, CSRF)?',
        'Explain your testing strategy (unit/integration/e2e).',
        'Describe a performance optimization you performed.'
    ],
    'Blockchain': [
        'Which blockchain platforms have you used (Ethereum, Solana)?',
        'Do you write smart contracts? Which languages?',
        'Have you audited or tested smart contracts?',
        'Which wallets and tooling do you use?',
        'How do you handle gas optimization?',
        'Have you deployed dApps to mainnet/testnet?',
        'Explain a security consideration for smart contracts.',
        'Do you work with oracles? Give an example.',
        'Have you worked with token standards (ERC20/ERC721)?',
        'Describe a project you built on blockchain.'
    ],
    'AI/ML': [
        'Which ML frameworks have you used (TensorFlow/PyTorch)?',
        'Describe a model you trained and deployed.',
        'How do you evaluate model performance?',
        'Have you worked with NLP or Computer Vision?',
        'Explain your data preprocessing steps.',
        'Have you used cloud ML services? Which ones?',
        'Do you use GPU acceleration? Describe setup.',
        'How do you monitor model drift and retraining?',
        'Explain a time you improved model accuracy.',
        'Describe any MLOps tools you have used.'
    ]
}

// Helpers
function show(elm) { elm.classList.remove('hidden') }
function hide(elm) { elm.classList.add('hidden') }

function setAuthState(authed) {
    if (authed) {
        hide(showRegisterBtn)
        hide(showLoginBtn)
        show(logoutBtn)
        hide(authForms)
        show(domainSelection)
    } else {
        show(showRegisterBtn)
        show(showLoginBtn)
        hide(logoutBtn)
        hide(domainSelection)
        hide(questionnaire)
        hide(success)
        show(authForms)
        show(registerForm)
        hide(loginForm)
        hide(resetRequestForm)
        hide(resetConfirmForm)
    }
}

// Scroll effect for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled')
    } else {
        navbar.classList.remove('scrolled')
    }
})

// Initialize
setAuthState(!!token)

// UI navigation
showRegisterBtn.onclick = () => {
    show(registerForm)
    hide(loginForm)
    hide(resetRequestForm)
    hide(resetConfirmForm)
}

showLoginBtn.onclick = () => {
    show(loginForm)
    hide(registerForm)
    hide(resetRequestForm)
    hide(resetConfirmForm)
}

logoutBtn.onclick = () => {
    localStorage.removeItem('token')
    token = null
    setAuthState(false)
}

// Switch between forms
const switchToLogin = el('switch-to-login')
if (switchToLogin) {
    switchToLogin.onclick = (e) => {
        e.preventDefault()
        show(loginForm)
        hide(registerForm)
    }
}

const switchToRegister = el('switch-to-register')
if (switchToRegister) {
    switchToRegister.onclick = (e) => {
        e.preventDefault()
        show(registerForm)
        hide(loginForm)
    }
}

const backToLogin = el('back-to-login')
if (backToLogin) {
    backToLogin.onclick = (e) => {
        e.preventDefault()
        show(loginForm)
        hide(resetRequestForm)
    }
}

// Register
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const form = new FormData(registerForm)
    const payload = {
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password')
    }
    
    try {
        const res = await fetch(API + '/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const j = await res.json()
        
        if (res.ok) {
            alert('✓ Registration successful! Please sign in.')
            show(loginForm)
            hide(registerForm)
            registerForm.reset()
        } else {
            alert(j.message || 'Registration failed')
        }
    } catch (err) {
        console.error(err)
        alert('Network error during registration')
    }
})

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const form = new FormData(loginForm)
    const payload = {
        email: form.get('email'),
        password: form.get('password')
    }
    
    try {
        const res = await fetch(API + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const j = await res.json()
        
        if (res.ok && j.token) {
            token = j.token
            localStorage.setItem('token', token)
            setAuthState(true)
            loginForm.reset()
        } else {
            alert(j.message || 'Login failed')
        }
    } catch (err) {
        console.error(err)
        alert('Network error during login')
    }
})

// Forgot password
const forgotLink = el('forgot-link')
if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault()
        hide(loginForm)
        show(resetRequestForm)
    })
}

// Password reset request
resetRequestForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const form = new FormData(resetRequestForm)
    const payload = { email: form.get('email') }
    
    try {
        const res = await fetch(API + '/api/auth/request-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const j = await res.json()
        alert(j.message || 'If account exists, reset link sent (check console in dev mode)')
        hide(resetRequestForm)
        show(loginForm)
        resetRequestForm.reset()
    } catch (err) {
        console.error(err)
        alert('Network error requesting reset')
    }
})

// Password reset confirm
resetConfirmForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const form = new FormData(resetConfirmForm)
    const payload = {
        token: form.get('token'),
        password: form.get('password')
    }
    
    try {
        const res = await fetch(API + '/api/auth/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const j = await res.json()
        alert(j.message || 'Password reset completed')
        hide(resetConfirmForm)
        show(loginForm)
        resetConfirmForm.reset()
    } catch (err) {
        console.error(err)
        alert('Network error performing reset')
    }
})

// Domain selection
document.querySelectorAll('.domain-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentDomain = btn.dataset.domain
        qTitle.textContent = currentDomain + ' — Screening Questionnaire'
        renderQuestions(currentDomain)
        hide(domainSelection)
        show(questionnaire)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
})

function renderQuestions(domain) {
    questionsDiv.innerHTML = ''
    const bank = questionBanks[domain] || []
    
    bank.forEach((q, i) => {
        const div = document.createElement('div')
        div.className = 'q'
        
        const label = document.createElement('label')
        label.textContent = `${i + 1}. ${q}`
        
        const textarea = document.createElement('textarea')
        textarea.name = 'q' + i
        textarea.rows = 3
        textarea.placeholder = 'Type your answer here...'
        
        div.appendChild(label)
        div.appendChild(textarea)
        questionsDiv.appendChild(div)
    })
}

// Submit questionnaire
qaForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    if (!token) {
        alert('Not authenticated')
        return
    }
    if (!currentDomain) {
        alert('No domain selected')
        return
    }

    const answers = []
    const bank = questionBanks[currentDomain]
    
    for (let i = 0; i < bank.length; i++) {
        const field = qaForm['q' + i]
        answers.push({
            q: bank[i],
            a: (field && field.value) ? field.value.trim() : ''
        })
    }
    
    const payload = {
        domain: currentDomain,
        experience: parseFloat(el('experience').value) || 0,
        candidateQuestions: el('candidate-questions').value || '',
        answers
    }

    try {
        const res = await fetch(API + '/api/survey/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        })
        const j = await res.json()
        
        if (res.ok) {
            hide(questionnaire)
            show(success)
            summary.textContent = `Domain: ${currentDomain} | Submission ID: ${j.id || 'pending'}`
            qaForm.reset()
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            alert(j.message || 'Failed to save responses')
        }
    } catch (err) {
        console.error(err)
        alert('Network error saving responses')
    }
})

// Return home button
const returnHomeBtn = el('return-home')
if (returnHomeBtn) {
    returnHomeBtn.addEventListener('click', () => {
        hide(success)
        show(domainSelection)
        currentDomain = null
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
}

// Check URL for reset token
(function checkUrlForToken() {
    try {
        const params = new URLSearchParams(location.search)
        if (params.get('reset')) {
            hide(authForms)
            show(resetConfirmForm)
            if (resetConfirmForm.token) {
                resetConfirmForm.token.value = params.get('reset')
            }
        }
    } catch (e) {
        console.warn('Could not parse URL params', e)
    }
})()