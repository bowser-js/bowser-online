import React from 'react';
// Instead of including bowser as a package.json dependency, use the latest
// version retrieved from a CDN and loaded via <script> tag.
// import bowser from 'bowser';
const bowser = window.bowser;

const ICON_SLUGS =
{
	// Browsers
	'chrome'            : 'googlechrome',
	'google chrome'     : 'googlechrome',
	'chromium'          : 'googlechrome',
	'firefox'           : 'firefox',
	'safari'            : 'safari',
	'microsoft edge'    : 'microsoftedge',
	'edge'              : 'microsoftedge',
	'opera'             : 'opera',
	'brave'             : 'brave',
	'vivaldi'           : 'vivaldi',
	'samsung internet'  : 'samsung',
	'internet explorer' : 'internetexplorer',
	'yandex browser'    : 'yandex',
	'uc browser'        : 'ucbrowser',
	'tor browser'       : 'torbrowser',
	'arc'               : 'arc',
	// Operating Systems
	'macos'             : 'apple',
	'mac os'            : 'apple',
	'ios'               : 'apple',
	'android'           : 'android',
	'linux'             : 'linux',
	'ubuntu'            : 'ubuntu',
	'fedora'            : 'fedora',
	'debian'            : 'debian',
	'chrome os'         : 'googlechrome',
	'chromeos'          : 'googlechrome',
	// Engines
	'blink'             : 'googlechrome',
	'webkit'            : 'safari',
	'gecko'             : 'firefox',
	// Platforms
	'apple'             : 'apple',
	'google'            : 'google',
	'samsung'           : 'samsung',
	'huawei'            : 'huawei',
	'xiaomi'            : 'xiaomi',
	'lenovo'            : 'lenovo'
};

// Inline SVG icons for brands missing from the Simple Icons CDN
const INLINE_ICONS =
{
	'windows'   : <svg className='brand-icon' viewBox='0 0 24 24' fill='#94A3B8'><path d='M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801'/></svg>,
	'microsoft' : <svg className='brand-icon' viewBox='0 0 24 24' fill='#94A3B8'><path d='M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z'/></svg>
};

class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state =
		{
			userAgent : navigator.userAgent,
			result    : null
		};
	}

	render()
	{
		const { userAgent, result } = this.state;

		return (
			<div data-component='App'>
				<div className='header'>
					<h1>
						<a
							href='https://github.com/bowser-js/bowser'
							target='_blank'
							rel='noopener noreferrer'
						>
							bowser
						</a>
						{' '}online
					</h1>
				</div>

				<div className='input-wrapper'>
					<span className='input-prompt'>{'>'}_</span>
					<input
						type='text'
						placeholder='navigator.userAgent'
						value={userAgent}
						autoCorrect='false'
						spellCheck='false'
						onChange={(event) =>
						{
							this.setState(
								{
									userAgent : event.target.value
								},
								() => this._runBowser());
						}}
					/>
				</div>

				<If condition={result}>
					<div className='result'>
						{
							Object.keys(result).map((section) => (
								<div className={`section section-${section}`} key={section}>
									<div className='section-header'>
										<div className='section-icon'>
											{this._getSectionIcon(section)}
										</div>
										<h3>{section}</h3>
									</div>
									{
										Object.keys(result[section]).map((item) => (
											<div className='line' key={item}>
												<p className='item'>{item}</p>
												<p className='value'>
													{this._renderValue(result[section][item], item)}
												</p>
											</div>
										))
									}
								</div>
							))
						}
					</div>
				</If>

				<div className='footer'>
					Powered by{' '}
					<a
						href='https://github.com/bowser-js/bowser'
						target='_blank'
						rel='noopener noreferrer'
					>
						bowser
					</a>
				</div>
			</div>
		);
	}

	componentDidMount()
	{
		this._runBowser();
	}

	_getSectionIcon(section)
	{
		const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' };

		switch (section)
		{
			case 'browser':
				return (
					<svg {...props}>
						<circle cx='12' cy='12' r='10'/>
						<line x1='2' y1='12' x2='22' y2='12'/>
						<path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/>
					</svg>
				);
			case 'os':
				return (
					<svg {...props}>
						<rect x='2' y='3' width='20' height='14' rx='2' ry='2'/>
						<line x1='8' y1='21' x2='16' y2='21'/>
						<line x1='12' y1='17' x2='12' y2='21'/>
					</svg>
				);
			case 'platform':
				return (
					<svg {...props}>
						<rect x='4' y='4' width='16' height='16' rx='2' ry='2'/>
						<rect x='9' y='9' width='6' height='6'/>
						<line x1='9' y1='1' x2='9' y2='4'/>
						<line x1='15' y1='1' x2='15' y2='4'/>
						<line x1='9' y1='20' x2='9' y2='23'/>
						<line x1='15' y1='20' x2='15' y2='23'/>
						<line x1='20' y1='9' x2='23' y2='9'/>
						<line x1='20' y1='14' x2='23' y2='14'/>
						<line x1='1' y1='9' x2='4' y2='9'/>
						<line x1='1' y1='14' x2='4' y2='14'/>
					</svg>
				);
			case 'engine':
				return (
					<svg {...props}>
						<circle cx='12' cy='12' r='3'/>
						<path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'/>
					</svg>
				);
			default:
				return (
					<svg {...props}>
						<polyline points='16 18 22 12 16 6'/>
						<polyline points='8 6 2 12 8 18'/>
					</svg>
				);
		}
	}

	_renderValue(value, item)
	{
		const displayValue = typeof value === 'string' ? value : JSON.stringify(value);

		if ((item === 'name' || item === 'vendor') && typeof value === 'string')
		{
			const key = value.toLowerCase();
			const inlineIcon = INLINE_ICONS[key];

			if (inlineIcon)
			{
				return (
					<span className='value-with-icon'>
						{inlineIcon}
						{displayValue}
					</span>
				);
			}

			const slug = ICON_SLUGS[key];

			if (slug)
			{
				return (
					<span className='value-with-icon'>
						<img
							className='brand-icon'
							src={`https://cdn.simpleicons.org/${slug}/94A3B8`}
							alt=''
						/>
						{displayValue}
					</span>
				);
			}
		}

		return displayValue;
	}

	_runBowser()
	{
		const { userAgent } = this.state;

		if (!userAgent)
			return;

		const browser = bowser.getParser(userAgent);

		this.setState({ result: browser.getResult() });
	}
}

export default App;
