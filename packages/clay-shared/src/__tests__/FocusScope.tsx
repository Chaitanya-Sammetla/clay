/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {cleanup, fireEvent, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import {ClayPortal, FocusScope} from '..';

import ClayDropDown from '../../../clay-drop-down/src';

const DropDownWithState: React.FunctionComponent<any> = ({
	children,
	...others
}) => {
	const [active, setActive] = React.useState(false);

	return (
		<ClayDropDown
			{...others}
			active={active}
			className="dropdown-test"
			onActiveChange={(val) => setActive(val)}
			renderMenuOnClick
			trigger={<button>Click Me</button>}
		>
			{children}
		</ClayDropDown>
	);
};

describe('FocusScope', () => {
	afterEach(() => {
		jest.clearAllTimers();
		document.body.innerHTML = '';
		cleanup();
	});

	afterAll(() => {
		document.body.innerHTML = '';
		cleanup();
	});

	beforeEach(() => {
		if (document) {
			const buttonNode = document.createElement('button');
			buttonNode.id = 'button1';

			const buttonNode2 = document.createElement('button');
			buttonNode2.id = 'button2';

			const reactRootNode = document.createElement('div');
			reactRootNode.id = 'reactRoot';

			document.body.appendChild(buttonNode);
			document.body.appendChild(reactRootNode);
			document.body.appendChild(buttonNode2);
		}

		render(
			<FocusScope>
				<div id="wrapper">
					<button id="reactButton">React</button>
					<ClayPortal>
						<ul>
							<li>
								<a href="#" id="linkInPortal1">
									link 1
								</a>
							</li>
							<li>
								<a href="#" id="linkInPortal2">
									link 2
								</a>
							</li>
							<li>
								<a href="#" id="linkInPortal3">
									link 3
								</a>
							</li>
						</ul>
					</ClayPortal>
				</div>
			</FocusScope>,
			{container: document.getElementById('reactRoot') as HTMLElement}
		);
	});

	it('manages focus order when using portals', () => {
		// Putting this snapshot inline to reference the structure of the DOM
		expect(document.body).toMatchInlineSnapshot(`
		<body>
		  <button
		    id="button1"
		  />
		  <div
		    id="reactRoot"
		  >
		    <div
		      id="wrapper"
		    >
		      <button
		        id="reactButton"
		      >
		        React
		      </button>
		    </div>
		  </div>
		  <button
		    id="button2"
		  />
		  <div>
		    <ul>
		      <li>
		        <a
		          href="#"
		          id="linkInPortal1"
		        >
		          link 1
		        </a>
		      </li>
		      <li>
		        <a
		          href="#"
		          id="linkInPortal2"
		        >
		          link 2
		        </a>
		      </li>
		      <li>
		        <a
		          href="#"
		          id="linkInPortal3"
		        >
		          link 3
		        </a>
		      </li>
		    </ul>
		  </div>
		</body>
	`);

		const htmlButton1 = document.getElementById('button1') as HTMLElement;
		const htmlButton2 = document.getElementById('button2') as HTMLElement;
		const reactButton = document.getElementById(
			'reactButton'
		) as HTMLElement;
		const linkInPortalOne = document.getElementById(
			'linkInPortal1'
		) as HTMLElement;
		const linkInPortalTwo = document.getElementById(
			'linkInPortal2'
		) as HTMLElement;
		const linkInPortalThree = document.getElementById(
			'linkInPortal3'
		) as HTMLElement;

		userEvent.tab();

		expect(htmlButton1).toHaveFocus();

		userEvent.tab();

		expect(reactButton).toHaveFocus();

		userEvent.tab();

		expect(linkInPortalOne).toHaveFocus();

		userEvent.tab();

		expect(linkInPortalTwo).toHaveFocus();

		userEvent.tab();

		expect(linkInPortalThree).toHaveFocus();

		userEvent.tab();

		expect(htmlButton2).toHaveFocus();
	});

	it('interacts with shift + tab', () => {
		const htmlButton1 = document.getElementById('button1') as HTMLElement;
		const htmlButton2 = document.getElementById('button2') as HTMLElement;

		const reactButton = document.getElementById(
			'reactButton'
		) as HTMLElement;

		htmlButton2.focus();

		expect(htmlButton2).toHaveFocus();

		userEvent.tab({shift: true});

		expect(reactButton).toHaveFocus();

		userEvent.tab({shift: true});

		expect(htmlButton1).toHaveFocus();
	});

	it('interacts with down arrow key', () => {
		const linkInPortalOne = document.getElementById(
			'linkInPortal1'
		) as HTMLElement;
		const linkInPortalTwo = document.getElementById(
			'linkInPortal2'
		) as HTMLElement;
		const linkInPortalThree = document.getElementById(
			'linkInPortal3'
		) as HTMLElement;

		linkInPortalOne.focus();

		expect(linkInPortalOne).toHaveFocus();

		fireEvent.keyDown(linkInPortalOne, {key: 'ArrowDown'});

		expect(linkInPortalTwo).toHaveFocus();

		fireEvent.keyDown(linkInPortalTwo, {key: 'ArrowDown'});

		expect(linkInPortalThree).toHaveFocus();

		fireEvent.keyDown(linkInPortalThree, {key: 'ArrowDown'});
	});

	it('interacts with up arrow key', () => {
		const linkInPortalOne = document.getElementById(
			'linkInPortal1'
		) as HTMLElement;
		const linkInPortalTwo = document.getElementById(
			'linkInPortal2'
		) as HTMLElement;
		const linkInPortalThree = document.getElementById(
			'linkInPortal3'
		) as HTMLElement;

		linkInPortalThree.focus();

		expect(linkInPortalThree).toHaveFocus();

		fireEvent.keyDown(linkInPortalThree, {key: 'ArrowUp'});

		expect(linkInPortalTwo).toHaveFocus();

		fireEvent.keyDown(linkInPortalTwo, {key: 'ArrowUp'});

		expect(linkInPortalOne).toHaveFocus();

		fireEvent.keyDown(linkInPortalOne, {key: 'ArrowUp'});
	});

	describe('FocusScope outside the React Tree', () => {
		beforeEach(() => {
			jest.clearAllTimers();
			document.body.innerHTML = '';
			cleanup();
		});

		it('interacts with React.Portal', () => {
			render(
				<>
					<ClayPortal>
						<div id="content">
							<button id="button1" />
						</div>
					</ClayPortal>

					<DropDownWithState>
						<ClayDropDown.ItemList>
							{[
								{href: '#one', label: 'one'},
								{href: '#two', label: 'two'},
							].map((item, i) => (
								<ClayDropDown.Item
									href={item.href}
									key={i}
									spritemap="/foo/bar"
								>
									{item.label}
								</ClayDropDown.Item>
							))}
						</ClayDropDown.ItemList>
					</DropDownWithState>
				</>
			);
			const dropdownButton = document.querySelector(
				'.dropdown-toggle'
			) as HTMLElement;
			const htmlButton1 = document.getElementById(
				'button1'
			) as HTMLElement;

			fireEvent.click(dropdownButton);

			const itemOne = (document.body as HTMLElement).querySelector(
				'a[href="#one"]'
			);

			userEvent.tab();

			expect(dropdownButton).toHaveFocus();

			const itemTwo = (document.body as HTMLElement).querySelector(
				'a[href="#two"]'
			);

			userEvent.tab();

			expect(htmlButton1).toHaveFocus();

			userEvent.tab();

			expect(itemOne).toHaveFocus();

			userEvent.tab();

			expect(itemTwo).toHaveFocus();
		});

		it('interacts without React.Portal', () => {
			render(
				<>
					<div id="content">
						<button id="button1" />
					</div>

					<DropDownWithState>
						<ClayDropDown.ItemList>
							{[
								{href: '#one', label: 'one'},
								{href: '#two', label: 'two'},
							].map((item, i) => (
								<ClayDropDown.Item
									href={item.href}
									key={i}
									spritemap="/foo/bar"
								>
									{item.label}
								</ClayDropDown.Item>
							))}
						</ClayDropDown.ItemList>
					</DropDownWithState>
				</>
			);

			const dropdownButton = document.querySelector(
				'.dropdown-toggle'
			) as HTMLElement;
			const htmlButton1 = document.getElementById(
				'button1'
			) as HTMLElement;

			dropdownButton.focus();

			fireEvent.click(dropdownButton);

			const itemOne = (document.body as HTMLElement).querySelector(
				'a[href="#one"]'
			);

			userEvent.tab();

			expect(itemOne).toHaveFocus();

			const itemTwo = (document.body as HTMLElement).querySelector(
				'a[href="#two"]'
			);

			userEvent.tab();

			expect(itemTwo).toHaveFocus();

			userEvent.tab();

			expect(document.body).toHaveFocus();

			userEvent.tab();

			expect(htmlButton1).toHaveFocus();
		});
	});
});
