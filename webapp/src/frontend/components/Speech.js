import React             from 'react';
import TimeUtils         from '../utils/TimeUtils';
import ImageUtils        from '../utils/ImageUtils';
import { Link }          from 'react-router';
import Icon              from 'react-fa';
import ImageWithFallback from './ImageWithFallback';

class Speech extends React.Component {
    constructor() {
        this.state = {useFallbackImage: false};
    }

    render() {
        let speech    = this.props.speech;
        let timestamp = TimeUtils.timestampForHit(speech);
        let title     = speech.title;

        if (speech.party) {
            title = `${title}, ${speech.party}`;
        }

        if (this.props.showTime) {
            timestamp = `${timestamp} ${TimeUtils.formatHitTime(speech)}`;
        }

        if (speech.name === 'Presidenten' && speech.presidents.length === 1) {
            var president      = speech.presidents[0];

            speech.name        = president.name;
            speech.external_id = president.external_id; // eslint-disable-line
        }

        return (
            <div>
                <div className="row speech">
                    <div className="col-xs-6 col-md-3">
                        <div className="row">
                            <div className="col-xs-1">
                                <Icon name="calendar" />
                            </div>

                            <div className="col-xs-8">
                                <Link to="speech" params={{transcript: speech.transcript, order: speech.order}}>
                                    <span className="text-muted">{timestamp}</span>
                                </Link>
                            </div>
                        </div>

                        <div className="row" style={{paddingTop: '0.8rem'}}>
                            <div className="col-xs-1">
                                <Icon name="user" />
                            </div>

                            <div className="col-xs-8">
                                <strong>{speech.name}</strong>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-1">
                            </div>

                            <div className="col-xs-8">
                                {title}
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-6 col-md-2">
                        <ImageWithFallback
                            className="img-responsive"
                            src={ImageUtils.personImageFor(speech.external_id)}
                            alt={speech.name}
                            height={180}
                            fallbackSrc={ImageUtils.fallbackImage()}
                        />
                    </div>

                    <div className="col-xs-12 col-md-7">
                        <div className="speech-text">{this.paragraphsFrom(speech)}</div>
                    </div>
                </div>

                <div className="row">
                    {this.renderContextLinkIfNecessary()}
                </div>
            </div>
        );
    }

    renderContextLinkIfNecessary() {
        if (this.props.showContextLink === false) {
            return null;
        } else {
            let linkParams = {
                transcript: this.props.speech.transcript,
                order: this.props.speech.order
            };

            return (
                <div className="context-link">
                    <Link to="speech" params={linkParams}>
                        Se innlegget i kontekst

                        <span style={{paddingLeft: '.5rem'}}>
                            <Icon name="comments" size="lg" />
                        </span>
                    </Link>
                </div>
            );
        }
    }

    paragraphsFrom(speech) {
        let text = speech.highlight ? speech.highlight.text.join('\n') : speech.text;

        return text.split('\n').map((fragment, i) => {
            fragment = fragment.replace(/<\/mark>(\s*)<mark>/g, '$1');

            return (<p key={i} dangerouslySetInnerHTML={{__html: fragment}} />);
        });
    }
}

Speech.propTypes = {
    speech: React.PropTypes.object.isRequired,
    showTime: React.PropTypes.bool,
    showContextLink: React.PropTypes.bool
};

module.exports = Speech;
