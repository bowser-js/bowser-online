import React from 'react';
import bowser from 'bowser';

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
							href='https://github.com/lancedikson/bowser'
							target='_blank'
							rel='noopener noreferrer'
						>
							bowser
						</a>
						&nbsp;online
					</h1>
				</div>

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

				<If condition={result}>
					<div className='result'>
						{
							Object.keys(result).map((section) => (
								<div className='section' key={section}>
									<h3>{section}</h3>
									{
										Object.keys(result[section]).map((item) => (
											<div className='line' key={item}>
												<p className='item'>{item}</p>
												<p className='value'>
													{JSON.stringify(result[section][item], null, '  ')}
												</p>
											</div>
										))
									}
								</div>
							))
						}
					</div>
				</If>
			</div>
		);
	}

	componentDidMount()
	{
		this._runBowser();
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
