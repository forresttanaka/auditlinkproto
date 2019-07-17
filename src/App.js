import React from 'react';
import PropTypes from 'prop-types';
import './App.css';


// Regex to find a simplified markdown in the form "{link text|path}"
const markdownRegex = /{(.+?)\|(.+?)}/g;
// Regex to find a paths in the form "/xxxx/yyyy/"
const pathRegex = /(\/.+?\/.+?\/)/g;


/**
 * Render audit-detail text, converting an extremely simplified markdown to links. If the text
 * doesn't contain any simplified markdown, convert anything that looks like a path to links.
 * Otherwise, just render the text without any link conversion.
 */
const AuditRenderDetail = ({ detail }) => {
	let linkMatches = markdownRegex.exec(detail);
	if (linkMatches) {
		// `detail` has at least one "markdown" sequence, so treat the whole thing as marked-down
		// text. Each loop iteration finds each markdown sequence. That gets broken into the
		// non-link text before the link and then the link itself.
		const renderedDetail = [];
		let segmentIndex = 0;
		while (linkMatches) {
			const linkText = linkMatches[1];
			const linkPath = linkMatches[2];
			const preText = detail.substring(segmentIndex, linkMatches.index);
			renderedDetail.push(preText ? <span key={segmentIndex}>{preText}</span> : null, <a href={linkPath} key={linkMatches.index}>{linkText}</a>);
			segmentIndex = linkMatches.index + linkMatches[0].length;
			linkMatches = markdownRegex.exec(detail);
		}

		// Lastly, render any non-link text after the last link.
		const postText = detail.substring(segmentIndex, detail.length);
		return renderedDetail.concat(postText ? <span key={segmentIndex}>{postText}</span> : null);
	}

	// TODO: Remove this segment of code once no audits include bare paths.
	linkMatches = pathRegex.exec(detail);
	if (linkMatches) {
		// `detail` has at least one "markdown" sequence, so treat the whole thing as marked-down
		// text. Each loop iteration finds each markdown sequence. That gets broken into the
		// non-link text before the link and then the link itself.
		const renderedDetail = [];
		let segmentIndex = 0;
		while (linkMatches) {
			const preText = detail.substring(segmentIndex, linkMatches.index);
			renderedDetail.push(preText ? <span key={segmentIndex}>{preText}</span> : null, <a href={linkMatches[0]} key={linkMatches.index}>{linkMatches[0]}</a>);
			segmentIndex = linkMatches.index + linkMatches[0].length;
			linkMatches = pathRegex.exec(detail);
		}

		// Lastly, render any non-link text after the last link.
		const postText = detail.substring(segmentIndex, detail.length);
		return renderedDetail.concat(postText ? <span key={segmentIndex}>{postText}</span> : null);
	}

	return detail;
};

AuditRenderDetail.propTypes = {
	/** Audit detail text, possibly containing @ids or marks to turn into links */
    detail: PropTypes.string.isRequired,
};


function App() {
	return (
		<div className="App">
			<span>++++</span>
			<div>
				<AuditRenderDetail detail="Of the {methods|/experiments/home/} can be decorators so that audit {code|/there/} or something." />
			</div>
			<div>
				<AuditRenderDetail detail="Of the /experiments/home/ can be decorators so that audit /there/home/ or something." />
			</div>
			<div>
				<AuditRenderDetail detail="Of the /experiments/ can be decorators so that audit or something." />
			</div>
			<span>++++</span>
		</div>
	);
}

export default App;
