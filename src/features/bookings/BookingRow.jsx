import styled from 'styled-components';
import PropTypes from 'prop-types';
import { format, isToday } from 'date-fns';
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiTrash
} from 'react-icons/hi2';

import Tag from '../../ui/Tag';
import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Menus from '../../ui/Menus';

import { formatCurrency } from '../../utils/helpers';
import { formatDistanceFromNow } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../check-in-out/useCheckout';
import { useDeleteBooking } from './useDeleteBooking';

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
`;

function BookingRow({
  booking: {
    // eslint-disable-next-line  no-unused-vars
    id: bookingId,
    // eslint-disable-next-line  no-unused-vars
    created_at,
    startDate,
    endDate,
    numNights,
    // eslint-disable-next-line  no-unused-vars
    numGuests,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName }
  }
}) {
  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { isDeletingBooking, deleteBooking } = useDeleteBooking();
  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver'
  };

  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? 'Today'
            : formatDistanceFromNow(startDate)}{' '}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), 'MMM dd yyyy')} &mdash;{' '}
          {format(new Date(endDate), 'MMM dd yyyy')}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={bookingId} />
          <Menus.List id={bookingId}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/bookings/${bookingId}`)}
            >
              See details
            </Menus.Button>
            {status === 'unconfirmed' && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/checkin/${bookingId}`)}
              >
                Check in
              </Menus.Button>
            )}
            {status === 'checked-in' && (
              <Menus.Button
                icon={<HiArrowUpOnSquare />}
                onClick={() => checkout(bookingId)}
                disabled={isCheckingOut}
              >
                Check out
              </Menus.Button>
            )}
            {status === 'unconfirmed' && (
              <>
                <Modal.Open opens='delete'>
                  <Menus.Button icon={<HiTrash />} disabled={isDeletingBooking}>
                    Delete Booking
                  </Menus.Button>
                </Modal.Open>
              </>
            )}
          </Menus.List>
          <Modal.Window name='delete'>
            <ConfirmDelete
              resourceName='bookings'
              disable={isDeletingBooking}
              onConfirm={() => deleteBooking(bookingId)}
            />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

BookingRow.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    numNights: PropTypes.number.isRequired,
    numGuests: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['unconfirmed', 'checked-in', 'checked-out'])
      .isRequired,
    guests: PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    }).isRequired,
    cabins: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default BookingRow;
