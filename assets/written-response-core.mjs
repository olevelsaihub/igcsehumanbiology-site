// Local, deterministic checks against the question's approved written answer.
// Similar words alone never earn marks or confirm an explanation.
import { assessPreparedResponse, cleanAnswer } from './response-checker-core.mjs?v=91ddc1ee35';

const prose = value => cleanAnswer(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[‐‑–—-]/g, ' ').replace(/[.,;:!?]/g, ' ').replace(/\s+/g, ' ').trim();
const name = value => prose(value).replace(/^(?:the answer is|it is|use) /, '').replace(/^(?:a|an|the) /, '');
const visual = /\b(draw|plot|sketch|label|shade|circle|arrow|line drawn|diagram should)\b/i;
const formulaText = value => cleanAnswer(value).replace(/\.$/, '').normalize('NFKC')
  .replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/\s+/g, '');
const formulas = [
  ['Average speed = distance travelled ÷ time taken.', ['v=s/t', 'speed=distance/time', 'average speed=distance travelled/time taken']],
  ['Acceleration = change in velocity ÷ time taken.', ['a=(v-u)/t', 'acceleration=change in velocity/time taken']],
  ['Momentum = mass × velocity.', ['p=mv', 'p=m*v', 'momentum=mass*velocity']],
  ['Wave speed = frequency × wavelength.', ['v=fλ', 'v=f*λ', 'wave speed=frequency*wavelength', 'speed=frequency*wavelength']],
  ['Density = mass ÷ volume.', ['ρ=m/V', 'density=mass/volume']],
  ['Power = current × voltage.', ['P=IV', 'P=VI', 'P=I*V', 'P=V*I', 'power=current*voltage', 'power=voltage*current']],
  ['Power = energy transferred ÷ time taken.', ['P=E/t', 'power=energy transferred/time taken', 'power=energy/time']],
  ['Voltage = current × resistance.', ['V=IR', 'V=RI', 'V=I*R', 'voltage=current*resistance']],
  ['Charge transferred = current × time.', ['Q=It', 'Q=I*t', 'charge=current*time', 'charge transferred=current*time']],
  ['Energy transferred = charge × voltage.', ['E=QV', 'E=Q*V', 'energy transferred=charge*voltage']],
  ['Resultant force = mass × acceleration.', ['F=ma', 'F=m*a', 'force=mass*acceleration', 'resultant force=mass*acceleration']],
  ['Weight = mass × gravitational field strength.', ['W=mg', 'W=m*g', 'weight=mass*gravitational field strength']],
  ['Pressure = force ÷ area.', ['p=F/A', 'pressure=force/area']],
  ['Pressure difference = height × density × gravitational field strength.', ['Δp=hρg', 'p=hρg', 'p=ρgh', 'pressure difference=height*density*gravitational field strength']],
  ['Kinetic energy = ½ × mass × speed².', ['Ek=0.5mv^2', 'Ek=1/2mv^2', 'E_k=0.5*m*v^2', 'kinetic energy=0.5*mass*speed^2']],
  ['Gravitational potential energy = mass × gravitational field strength × height.', ['ΔEp=mgΔh', 'Ep=mgh', 'GPE=mgh', 'gravitational potential energy=mass*gravitational field strength*height']],
  ['Moment = force × perpendicular distance from the pivot.', ['moment=force*perpendicular distance', 'moment=force*perpendicular distance from the pivot']],
  ['Work done = force × distance moved in the direction of the force.', ['W=Fd', 'W=F*d', 'work done=force*distance moved in the direction of the force']],
  ['Efficiency = useful energy output ÷ total energy input.', ['efficiency=useful energy output/total energy input', 'efficiency=useful energy output/total energy input*100', 'efficiency=(useful energy output/total energy input)*100%']],
  ['Refractive index = sin(angle of incidence) ÷ sin(angle of refraction).', ['n=sin i/sin r', 'refractive index=sin(angle of incidence)/sin(angle of refraction)']],
  ['sin c = 1/n,', ['sin c=1/n']],
  ['Vₚ/Vₛ = Nₚ/Nₛ', ['Vp/Vs=Np/Ns', 'V_p/V_s=N_p/N_s', 'Vₚ/Vₛ=Nₚ/Nₛ']],
  ['For a 100% efficient transformer,', ['VpIp=VsIs', 'Vp*Ip=Vs*Is', 'VₚIₚ=VₛIₛ', 'input power=output power']],
];

// Aliases apply only when this exact name is the question's approved response.
const aliases = [
  ['milky way galaxy', 'milky way'], ['gravitational force', 'gravity'],
  ['alternating current a c', 'alternating current', 'ac', 'a c'],
  ['direct current d c', 'direct current', 'dc', 'd c'],
  ['ntc thermistor', 'thermistor'], ['infrared radiation', 'infrared', 'infra red radiation'],
  ['the speed of the car', 'speed of the car', 'speed'],
  ['centre of gravity', 'center of gravity'],
];

// These small rubrics are tied to an exact approved response, not a topic-wide
// bag of words. Each alternative expresses a relationship in the right order.
const rubrics = [
  {
    reference:'The balls have lost electrons.',
    points:[{label:'The balls lose electrons, leaving them positively charged.', patterns:[/\b(?:balls? |they )?(?:have |has )?(?:lost|lose|loses) (?:some )?electrons\b/, /\belectrons (?:have been |are |were )?(?:removed|lost)\b/]}],
    contradict:/\b(?:gain|gained|gains)\b|\b(?:lost|lose|gained|gain) protons\b|\b(?:not|never|don't|cannot|can't)\b/,
  },
  {
    reference:'The gas particles move rapidly and randomly in all directions.',
    points:[{label:'Particles move randomly in all directions.',patterns:[/\b(?:move|moving|motion)\b.*\b(?:randomly|random|all directions)\b/, /\brandom (?:motion|movement)\b/]},
      {label:'The particles move rapidly.',patterns:[/\b(?:rapidly|quickly|fast|high speed)\b/]}],
    contradict:/\b(?:not|never|don't|cannot|can't|stationary|stopped|same direction|one direction)\b/,
  },
  {
    reference:'Waves transfer energy by vibrations or oscillations, without transferring matter overall.',
    required:2, // Source: November 2025 1P Q10(a), any two of these three points.
    points:[{label:'Waves transfer energy.',patterns:[/\b(?:transfer|transmit|carry) (?:energy|information)\b/,/\b(?:energy|information) (?:is |can be )?(?:transferred|transmitted|carried)\b/]},
      {label:'There is no overall transfer of matter.',patterns:[/\b(?:without|not|no)\b.*\b(?:transfer|transferring|transferred|transport|transported)\b.*\b(?:matter|particles)\b/,/\b(?:matter|particles)\b.*\b(?:not|no)\b.*\b(?:transferred|transported|transfer)\b/]},
      {label:'Waves involve vibrations or oscillations.',patterns:[/\b(?:vibrations?|oscillations?|vibrate|oscillate)\b/]}],
    contradict:/\b(?:do not|don't|cannot|can't|never) (?:transfer|carry|transmit) energy\b|\btransfer (?:both )?energy and matter\b|\b(?:not|no|without) (?:transfer|transferring) (?:mass|matter) or energy\b|\b(?:no|without) (?:vibrations?|oscillations?)\b|\b(?:not|never) (?:vibrate|oscillate)\b/,
  },
  {
    reference:'Particles colliding with the walls exert a force. Pressure is this force per unit area.',
    points:[{label:'Particles collide with the walls and exert a force.',patterns:[/\b(?:particles|molecules)\b.*\b(?:collid\w*|hit)\b.*\bwalls?\b.*\bforce\b/]},
      {label:'Pressure is force per unit area.',patterns:[/\bpressure\b.*\bforce\b.*\b(?:per unit area|divided by area)\b/]}],
    contradict:/\b(?:do not|don't|never|cannot|can't|no force|do not collide)\b/,
  },
];

const superscripts = { '⁰':'0', '¹':'1', '²':'2', '³':'3', '⁴':'4', '⁵':'5', '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9', '⁻':'-' };
function numericText(value) {
  return cleanAnswer(value).replace(/(?:approximately|about|final answer|answer)\s*[:=]?\s*/gi, '')
    .replace(/[−–]/g, '-').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, s => '^' + [...s].map(c => superscripts[c]).join(''))
    .replace(/[()]/g, '').replace(/\.$/, '').replace(/,/g, '').trim();
}

const units = {
  '': ['scalar', 1], '%': ['percent', 1], '°': ['angle', 1], 'degrees': ['angle', 1], 'degree': ['angle', 1],
  m:['length',1], cm:['length',.01], mm:['length',.001], km:['length',1000], nm:['length',1e-9],
  s:['time',1], ms:['time',.001], min:['time',60], h:['time',3600],
  kg:['mass',1], g:['mass',.001], N:['force',1], kN:['force',1000],
  J:['energy',1], kJ:['energy',1000], MJ:['energy',1e6], W:['power',1], kW:['power',1000], MW:['power',1e6],
  V:['voltage',1], mV:['voltage',.001], kV:['voltage',1000], A:['current',1], mA:['current',.001],
  Ω:['resistance',1], kΩ:['resistance',1000], Hz:['frequency',1], kHz:['frequency',1000], MHz:['frequency',1e6],
  Bq:['activity',1], kBq:['activity',1000], C:['charge',1], Pa:['pressure',1], kPa:['pressure',1000],
  'm/s':['speed',1], 'km/s':['speed',1000], 'km/h':['speed',1/3.6], 'm/s2':['acceleration',1],
  'm2':['area',1], 'cm2':['area',1e-4], 'm3':['volume',1], 'cm3':['volume',1e-6],
  'kg/m3':['density',1], 'g/cm3':['density',1000], 'Nm':['moment',1], 'Ncm':['moment',.01],
  'kgm/s':['momentum',1], 'N/kg':['field',1], K:['kelvin',1], '°C':['celsius',1],
  'counts/min':['count-rate',1], 'counts/s':['count-rate',60],
};
const unitNames = { metres:'m', metre:'m', meters:'m', meter:'m', seconds:'s', second:'s',
  minutes:'min', minute:'min', hours:'h', hour:'h', newtons:'N', newton:'N', joules:'J', joule:'J',
  watts:'W', watt:'W', volts:'V', volt:'V', amperes:'A', ampere:'A', ohms:'Ω', ohm:'Ω', hertz:'Hz',
  kilograms:'kg', kilogram:'kg', grams:'g', gram:'g', 'counts per minute':'counts/min', 'counts per second':'counts/s' };
export function parseQuantity(value) {
  const text = numericText(value);
  const match = text.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*(?:[eE]|[×x*]\s*10\s*\^?)\s*([+-]?\d+))?\s*([^\d]*.*?)$/);
  if (!match) return null;
  const unit = (unitNames[match[3].trim()] || match[3]).replace(/\s+/g, '').replace(/\^/g, '');
  if (!Object.hasOwn(units, unit)) return null;
  const number = Number(match[1]) * 10 ** Number(match[2] || 0);
  const [dimension, scale] = units[unit];
  return Number.isFinite(number) ? {number, unit, dimension, value:number * scale} : null;
}

function finalQuantity(value) {
  // Only the final non-empty line/expression, never an earlier matching number.
  const line = cleanAnswer(value).split('\n').filter(s => s.trim()).at(-1) || '';
  return parseQuantity(line.split(/[=≈]/).at(-1));
}
const same = (a,b) => Math.abs(a-b) <= Math.abs(b)*1e-9;
const verdict = (status, message, extra={}) => ({status, message, ...extra});

export function checkWrittenAnswer(value, groups=[], paragraphs=[], {marks=1}={}) {
  const answer = cleanAnswer(value);
  if (!answer) return verdict('empty', 'Write an answer first.');
  const checked = assessPreparedResponse(answer, groups);
  if (checked.answerKeyMatched) return verdict('secure', 'Your answer is correct.', {score:marks});
  const reference = paragraphs.map(cleanAnswer).filter(Boolean);
  const first = reference[0] || '';
  const drawing = reference.some(p => visual.test(p));
  const expected = parseQuantity(first) || (!reference.length ? parseQuantity(groups.find(g=>g.role==='result')?.label) : null);
  if (expected && !drawing) {
    // An authored final working line may retain more precision than the headline.
    // Use only that last result, with matching dimensions and close agreement,
    // never arbitrary intermediate numbers from the solution.
    const unrounded = reference.length > 1 ? finalQuantity(reference.at(-1)) : null;
    const allowed = [expected];
    if (unrounded && unrounded.dimension===expected.dimension && Math.abs(unrounded.value-expected.value)<=Math.abs(expected.value)*0.05) allowed.push(unrounded);
    const actual = finalQuantity(answer);
    if (actual) {
      if (actual.dimension === expected.dimension && allowed.some(q=>same(actual.value,q.value))) {
        return verdict('final-match', `Final answer correct. Your final value${expected.unit ? ' and unit' : ''} match${expected.unit ? '' : 'es'}. Check your method against the steps below; working and method marks have not been checked.`);
      }
      if (!actual.unit && expected.unit) return verdict('review', `Add the unit ${expected.unit} to your final answer. The value alone is not a complete answer.`);
      if (actual.dimension !== expected.dimension) return verdict('review', `Check your unit. This answer needs ${expected.unit || 'a number without a unit'}, not ${actual.unit}.`);
      return verdict('review', 'Your final value does not match the expected result. Check your substitution, arithmetic and unit conversion.');
    }
    return verdict('unverified', `I could not identify one final value. Put your final answer on the last line${expected.unit ? ', with the unit '+expected.unit : ''}.`);
  }
  const option = first.match(/^(?:Option\s+)?([A-D])(?:\s*[:.]|$)/);
  if (option && /^(?:option\s+)?[A-D]\.?$/i.test(answer)) {
    return answer.replace(/^option\s+/i,'').replace(/\.$/,'').toUpperCase()===option[1]
      ? verdict('secure','Your answer is correct.')
      : verdict('review',`Incorrect. The correct option is ${option[1]}.`);
  }
  if (checked.resultMatched && !reference.length) return verdict('final-match', 'Final answer correct. Working and method marks have not been checked.');
  const formula = formulas.find(([prefix]) => first.startsWith(prefix));
  if (formula) {
    const candidates = [first, ...formula[1]];
    if (candidates.some(p => formulaText(p) === formulaText(answer))) return verdict('secure', 'Your formula is correct.');
    return verdict('review', `Check the relationship and the order of the quantities. The expected formula is ${formula[1][0]}.`);
  }
  const rubric = rubrics.find(r => prose(r.reference) === prose(first));
  if (rubric) {
    const text = prose(answer);
    if (rubric.contradict.test(text)) return verdict('review', `Your answer contains a conflicting statement. ${rubric.points[0].label}`);
    const matched = rubric.points.filter(p=>p.patterns.some(pattern=>pattern.test(text)));
    const missing = rubric.points.filter(p=>!matched.includes(p));
    if (matched.length >= (rubric.required || rubric.points.length)) return verdict('secure', 'Your answer includes the required Human Biology points.');
    return verdict('review', `${matched.length ? 'Partly correct. ' : ''}Add this point: ${missing[0].label}`, {matchedPoints:matched.length,totalPoints:rubric.points.length});
  }
  if (first && !drawing) {
    const complete = reference.join(' ');
    // Exact complete prose, not unordered keyword similarity. Keep symbols case-sensitive.
    const symbolic = /[=²³₀-₉→]|\d/.test(complete) || /^[A-Za-zµμ]{1,3}\.?$/.test(first);
    const matches = symbolic ? answer.replace(/\.$/,'') === complete.replace(/\.$/,'') : prose(answer) === prose(complete);
    if (matches) return verdict('secure', 'Your written answer matches the expected response.');
    if (marks === 1 && reference.length === 1 && first.split(/\s+/).length <= 7 && !symbolic) {
      const accepted = aliases.find(list => list.some(p => name(p) === name(first))) || [first];
      if (accepted.some(p=> name(p) === name(answer))) return verdict('secure', 'Your answer is correct.');
    }
    // Report complete reference sentences found, without treating keyword overlap as marks.
    const points = complete.split(/(?<=[.!?])\s+/).filter(p=>p.split(/\s+/).length>=4);
    const supplied = prose(answer);
    const matched = points.filter(p => (' '+supplied+' ').includes(' '+prose(p)+' '));
    const missing = points.filter(p=>!matched.includes(p));
    if (matched.length && missing.length) return verdict('review', `You have included ${matched.length} of ${points.length} expected statements. Add this point: ${missing[0]}`, {matchedPoints:matched.length,totalPoints:points.length});
    const short = reference.length===1 && first.split(/\s+/).length<=7;
    return verdict('unverified', short
      ? `Your wording has not matched the expected answer: ${first} Give one clear scientific name or statement.`
      : `I could not confirm the full explanation. Make this point clear in your answer: ${points[0] || first}`);
  }
  return verdict('unverified', drawing
    ? 'This question needs a drawing, graph or labelled diagram. Typed text cannot verify its positions and shapes. Use the answer below to check those details.'
    : 'There is no reliable written-answer rule for this part yet. The answer below shows what is required.');
}
