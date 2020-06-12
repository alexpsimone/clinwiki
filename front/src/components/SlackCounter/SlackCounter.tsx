import React from 'react'
// import reactCSS, { hover } from 'reactcss'
import _ from 'lodash'
import styled from 'styled-components';
import SlackCounterGroup from './SlackCounterGroup'
import { find, propEq, findLastIndex, filter } from 'ramda';
import { Icon, InlineIcon } from '@iconify/react';
import smilePlus from '@iconify/icons-fe/smile-plus';
import { isReactionUnique, reactionCharacterFromName } from 'utils/reactions/reactionKinds';



interface SlackCounterProps {
    reactions: any;
    user: any;
    onSelect: any;
    onAdd: any;
    nctId: any;
    currentUserAndStudy: any;
}
interface SlackCounterState {
    showLabel: boolean;
}
const Counter = styled.div`
    display: flex;

    .add{
        cursor: pointer;
        font-family: Slack;
        opacity: 1;
        transition: opacity 0.1s ease-in-out;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        background: #6BA5D6;
        border: 1px solid #5786AD;
        border-radius: 5px;

    }
    .group-active{
        margin-right: 4px;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        background: #6BA5D6;
        border: 1px solid #5786AD;
        border-radius: 5px;
        cursor:pointer;
    }
    .group-not-active{
        margin-right: 4px;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        background: transparent;
        border: 1px solid #5786AD;
        border-radius: 5px;
        cursor:not-allowed;

    }
`
class SlackCounter extends React.Component<SlackCounterProps, SlackCounterState> {
    state: SlackCounterState = {
        showLabel: false,
    }


    componentDidMount() {

    }
    render() {
        let addEmoji = <Icon icon={smilePlus} width="1.5em" />
        return (
            <Counter>

                {this.props.reactions.map((reaction, index) => {

                    let emoji = reactionCharacterFromName(reaction.name) 
                    let isActive = isReactionUnique(emoji, this.props.currentUserAndStudy)
                    if (isActive) {
                        return (
                            <div className="group-active" key={reaction + index}>

                                <SlackCounterGroup
                                    emoji={emoji}
                                    count={reaction.count}
                                    names={' '}
                                    active={' '}
                                    onSelect={this.props.onSelect}

                                />
                            </div>
                        )
                    } else if (isActive == undefined) {
                        return (
                            //   <div className={hasReacted ==true ? "group-active": "group-not-active"} key={ emoji }>
                            <div className="group-not-active" key={reaction + index}
                            >

                                <SlackCounterGroup
                                    emoji={emoji}
                                    count={reaction.count}
                                    names={' '}
                                    active={' '}
                                    onSelect={this.props.onSelect}

                                />
                            </div>
                        )
                    } else {
                        return
                    }

                })}
                <div className="add" onClick={this.props.onAdd}>
                    <SlackCounterGroup
                        emoji={addEmoji}
                        count={''}
                        names={''}
                        active={''}
                        onSelect={''}

                    />

                </div>
            </Counter>
        )
    }


}

export default SlackCounter