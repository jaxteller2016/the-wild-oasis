import styled from 'styled-components';
// eslint-disable-next-line  no-unused-vars
import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking';
import Spinner from '../../ui/Spinner';
import { useNavigate } from 'react-router-dom';
import { HiArrowUpOnSquare, HiTrash } from 'react-icons/hi2';
import { useCheckout } from '../check-in-out/useCheckout';
import { useDeleteBooking } from './useDeleteBooking';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  // eslint-disable-next-line  no-unused-vars
  const { booking, isLoading } = useBooking();
  const { checkout, isCheckingOut } = useCheckout();
  const { isDeletingBooking, deleteBooking } = useDeleteBooking();

  const navigate = useNavigate();

  const moveBack = useMoveBack();

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver'
  };

  if (isLoading) return <Spinner />;

  const { status, id: bookingId } = booking;

  return (
    <>
      <Row type='horizontal'>
        <HeadingGroup>
          <Heading as='h1'>Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        <Modal>
          {status === 'unconfirmed' && (
            <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
              Check in
            </Button>
          )}
          {status === 'checked-in' && (
            <Button
              icon={<HiArrowUpOnSquare />}
              onClick={() => checkout(bookingId)}
              disabled={isCheckingOut}
            >
              Check out
            </Button>
          )}
          {status === 'unconfirmed' && (
            <>
              <Modal.Open opens='delete'>
                <Button
                  icon={<HiTrash />}
                  disabled={isDeletingBooking}
                  variation='danger'
                >
                  Delete Booking
                </Button>
              </Modal.Open>
            </>
          )}
          <Button variation='secondary' onClick={moveBack}>
            Back
          </Button>
          <Modal.Window name='delete'>
            <ConfirmDelete
              resourceName='bookings'
              disable={isDeletingBooking}
              onConfirm={() => {
                deleteBooking(bookingId, {
                  onSettled: () => navigate(`/bookings`)
                });
              }}
            />
          </Modal.Window>
        </Modal>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
