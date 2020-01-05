import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';

import {
  MeetupCard,
  MeetupBanner,
  MeetupTitle,
  MeetupInfo,
  MeetupInfoText,
  SubscribeButton,
} from './styles';

export default function Meetup({
  data,
  onPressFunction,
  load,
  subscribe,
  disabled,
}) {
  return (
    <MeetupCard>
      <MeetupBanner
        source={{ uri: data.banner.url.replace('localhost', '192.168.0.15') }}
      />
      <MeetupTitle>{data.title}</MeetupTitle>
      <MeetupInfo>
        <Icon name="event" size={14} color="#999" />
        <MeetupInfoText>
          {format(parseISO(data.date), 'MMMM do, yyyy, h a')}
        </MeetupInfoText>
      </MeetupInfo>
      <MeetupInfo>
        <Icon name="place" size={14} color="#999" />
        <MeetupInfoText>{data.location}</MeetupInfoText>
      </MeetupInfo>
      <MeetupInfo>
        <Icon name="person" size={14} color="#999" />
        <MeetupInfoText>{data.organizer.name}</MeetupInfoText>
      </MeetupInfo>
      {subscribe ? (
        <SubscribeButton
          disabled={disabled}
          loading={load}
          style={{ backgroundColor: '#f94d6a' }}
          small
          onPress={onPressFunction}
        >
          {disabled ? 'Already subscribed' : 'Subscribe'}
        </SubscribeButton>
      ) : (
        <SubscribeButton loading={load} small onPress={onPressFunction}>
          Unsubscribe
        </SubscribeButton>
      )}
    </MeetupCard>
  );
}

Meetup.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    location: PropTypes.string,
    banner: PropTypes.shape({
      url: PropTypes.string,
    }),
    organizer: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  onPressFunction: PropTypes.func.isRequired,
  load: PropTypes.bool,
  subscribe: PropTypes.bool,
  disabled: PropTypes.bool,
};

Meetup.defaultProps = {
  load: false,
  subscribe: false,
  disabled: false,
};
